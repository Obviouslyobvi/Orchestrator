import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Onboard from './pages/Onboard';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import NewProjectModal from './components/NewProjectModal';
import MemoryPanel from './components/MemoryPanel';
import MemoryModal from './components/MemoryModal';
import { initialProjects } from './data/mockData';
import { buildProjectSteps, buildPrompt, createCustomStep } from './logic/promptGenerator';
import { baselineRankings } from './data/baselineRankings';
import { pickBestModel } from './logic/modelRouter';
import { getAuthState, setAuthState } from './services/googleAuth';
import { readDriveFile, writeDriveFile } from './services/googleDrive';
import { getLeaderboardData } from './services/artificialAnalysis';

const formatTime = (value) => {
  if (!value) {
    return 'just now';
  }
  const date = new Date(value);
  return date.toLocaleString();
};

const App = () => {
  const navigate = useNavigate();
  const [authState, setAuthStateLocal] = useState(() => getAuthState());
  const [leaderboard, setLeaderboard] = useState(baselineRankings);
  const [leaderboardUpdatedAt, setLeaderboardUpdatedAt] = useState('');
  const [projects, setProjects] = useState(() =>
    initialProjects.map((project) => ({
      ...project,
      activeStepId:
        project.activeStepId ||
        project.steps?.find((step) => step.status === 'Active')?.id ||
        project.steps?.[0]?.id
    }))
  );
  const [memoryItems, setMemoryItems] = useState([]);
  const [modelPrefs, setModelPrefs] = useState({ excludedModels: [] });
  const [showModal, setShowModal] = useState(false);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [suggestedMemory, setSuggestedMemory] = useState(null);
  const [syncStatus, setSyncStatus] = useState('Offline');
  const [lastSyncAt, setLastSyncAt] = useState('');

  const normalizeProjects = (data) => {
    return data.map((project) => ({
      ...project,
      activeStepId:
        project.activeStepId ||
        project.steps?.find((step) => step.status === 'Active')?.id ||
        project.steps?.[0]?.id
    }));
  };

  useEffect(() => {
    const driveProjects = readDriveFile('projects.json');
    const driveMemory = readDriveFile('memory.json');
    const drivePrefs = readDriveFile('preferences.json');
    if (driveProjects) {
      setProjects(normalizeProjects(driveProjects));
    }
    if (driveMemory) {
      setMemoryItems(driveMemory);
    }
    if (drivePrefs) {
      setModelPrefs(drivePrefs);
    }
  }, []);

  useEffect(() => {
    setAuthState(authState);
  }, [authState]);

  useEffect(() => {
    const syncToDrive = () => {
      if (!authState.driveConnected) {
        setSyncStatus('Disconnected');
        return;
      }
      writeDriveFile('projects.json', projects);
      writeDriveFile('memory.json', memoryItems);
      writeDriveFile('preferences.json', modelPrefs);
      setSyncStatus('Synced');
      setLastSyncAt(formatTime(new Date().toISOString()));
    };
    syncToDrive();
  }, [projects, memoryItems, modelPrefs, authState.driveConnected]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const { leaderboard: data } = await getLeaderboardData({
        apiKey: authState.apiKey,
        fallback: baselineRankings
      });
      setLeaderboard(data);
      setLeaderboardUpdatedAt(formatTime(data.updatedAt));
      if (authState.driveConnected) {
        writeDriveFile('leaderboard_cache.json', data);
      }
    };
    loadLeaderboard();
  }, [authState.apiKey, authState.driveConnected]);

  const handleCreateProject = ({ name, description }) => {
    const steps = buildProjectSteps({
      projectName: name,
      projectDescription: description,
      leaderboard,
      excludedModels: modelPrefs.excludedModels,
      memoryItems
    });
    const newProject = {
      id: `project-${Date.now()}`,
      name,
      description,
      status: 'In Progress',
      favorite: false,
      activeStepId: steps[0]?.id,
      steps
    };
    setProjects((prev) => [newProject, ...prev]);
    setShowModal(false);
    navigate(`/app/project/${newProject.id}`);
  };

  const handleSelectStep = (projectId, stepId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, activeStepId: stepId }
          : project
      )
    );
  };

  const updateProjectSteps = (projectId, updater) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        return {
          ...project,
          steps: updater(project.steps)
        };
      })
    );
  };

  const handleUpdatePrompt = (projectId, stepId, prompt) => {
    updateProjectSteps(projectId, (steps) =>
      steps.map((step) => (step.id === stepId ? { ...step, prompt } : step))
    );
  };

  const handleOverrideModel = (projectId, stepId, model) => {
    updateProjectSteps(projectId, (steps) =>
      steps.map((step) => {
        if (step.id !== stepId) {
          return step;
        }
        const prompt = buildPrompt({
          projectName: projects.find((proj) => proj.id === projectId)?.name,
          projectDescription: projects.find((proj) => proj.id === projectId)?.description,
          stepTitle: step.title,
          taskType: step.taskType,
          modelName: model,
          memoryItems
        });
        return {
          ...step,
          model,
          reason: 'Manual override selected by you.',
          score: null,
          indexLabel: 'Manual override',
          prompt
        };
      })
    );
  };

  const handleSubmitResponse = (projectId, stepId, response) => {
    if (!response.trim()) {
      return;
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedSteps = project.steps.map((step) => {
          if (step.id === stepId) {
            return { ...step, response, status: 'Done' };
          }
          return step;
        });

        const nextStep = updatedSteps.find((step) => step.status === 'Pending');
        const finalSteps = updatedSteps.map((step) => {
          if (step.id === nextStep?.id) {
            return { ...step, status: 'Active' };
          }
          if (step.status === 'Active' && step.id !== stepId) {
            return { ...step, status: 'Pending' };
          }
          return step;
        });

        return {
          ...project,
          steps: finalSteps,
          activeStepId: nextStep?.id || stepId,
          status: nextStep ? 'In Progress' : 'Done'
        };
      })
    );

    setSuggestedMemory({
      title: 'Save a key takeaway',
      content: response.slice(0, 240),
      tag: 'Decision'
    });
  };

  const handleAddCustomStep = (projectId, data) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }
        const newStep = createCustomStep({
          title: data.title,
          model: data.model,
          projectName: project.name,
          projectDescription: project.description,
          memoryItems
        });
        return {
          ...project,
          steps: [...project.steps, newStep]
        };
      })
    );
  };

  const refreshPromptsWithMemory = () => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        steps: project.steps.map((step) => ({
          ...step,
          prompt: buildPrompt({
            projectName: project.name,
            projectDescription: project.description,
            stepTitle: step.title,
            taskType: step.taskType,
            modelName: step.model,
            memoryItems
          })
        }))
      }))
    );
  };

  useEffect(() => {
    refreshPromptsWithMemory();
  }, [memoryItems]);

  const handleSaveMemory = (item) => {
    const newItem = {
      id: item.id || `mem-${Date.now()}`,
      title: item.title,
      content: item.content,
      tag: item.tag
    };
    setMemoryItems((prev) => {
      const existingIndex = prev.findIndex((mem) => mem.id === newItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newItem;
        return updated;
      }
      return [newItem, ...prev];
    });
  };

  const handleDeleteMemory = (id) => {
    setMemoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConnectDrive = () => {
    setAuthStateLocal((prev) => ({ ...prev, driveConnected: true, onboarded: true }));
    navigate('/app');
  };

  const handleSaveApiKey = (apiKey) => {
    setAuthStateLocal((prev) => ({ ...prev, apiKey, onboarded: true }));
  };

  const handleSkipOnboard = () => {
    setAuthStateLocal((prev) => ({ ...prev, onboarded: true }));
    navigate('/app');
  };

  const handleToggleModel = (model) => {
    setModelPrefs((prev) => {
      const excluded = prev.excludedModels.includes(model)
        ? prev.excludedModels.filter((item) => item !== model)
        : [...prev.excludedModels, model];
      return { ...prev, excludedModels: excluded };
    });
  };

  const updateModelAssignments = () => {
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        steps: project.steps.map((step) => {
          if (step.taskType === 'Custom Step') {
            return step;
          }
          const routing = pickBestModel({
            taskType: step.taskType,
            rankings: leaderboard,
            excludedModels: modelPrefs.excludedModels
          });
          return {
            ...step,
            model: routing.model,
            reason: routing.reason,
            score: routing.score,
            indexLabel: routing.indexLabel,
            prompt: buildPrompt({
              projectName: project.name,
              projectDescription: project.description,
              stepTitle: step.title,
              taskType: step.taskType,
              modelName: routing.model,
              memoryItems
            })
          };
        })
      }))
    );
  };

  useEffect(() => {
    updateModelAssignments();
  }, [leaderboard, modelPrefs.excludedModels]);

  const projectById = useMemo(() => {
    return Object.fromEntries(projects.map((project) => [project.id, project]));
  }, [projects]);

  return (
    <div className="min-h-screen bg-base text-white">
      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateProject}
        />
      )}
      {showMemoryPanel && (
        <MemoryPanel
          items={memoryItems}
          onClose={() => setShowMemoryPanel(false)}
          onSave={handleSaveMemory}
          onDelete={handleDeleteMemory}
        />
      )}
      {suggestedMemory && (
        <MemoryModal
          initialValue={suggestedMemory}
          onClose={() => setSuggestedMemory(null)}
          onSave={(item) => {
            handleSaveMemory(item);
            setSuggestedMemory(null);
          }}
        />
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/onboard"
          element={
            <Onboard
              authState={authState}
              onConnectDrive={handleConnectDrive}
              onSaveApiKey={handleSaveApiKey}
              onSkip={handleSkipOnboard}
            />
          }
        />
        <Route
          path="/app"
          element={
            authState.onboarded ? (
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  projects={projects}
                  onNewProject={() => setShowModal(true)}
                  onOpenMemory={() => setShowMemoryPanel(true)}
                  syncStatus={syncStatus}
                  leaderboardUpdatedAt={leaderboardUpdatedAt}
                  lastSyncAt={lastSyncAt}
                />
                <Dashboard projects={projects} onNewProject={() => setShowModal(true)} />
              </div>
            ) : (
              <Navigate to="/onboard" replace />
            )
          }
        />
        <Route
          path="/app/project/:id"
          element={
            authState.onboarded ? (
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  projects={projects}
                  onNewProject={() => setShowModal(true)}
                  onOpenMemory={() => setShowMemoryPanel(true)}
                  syncStatus={syncStatus}
                  leaderboardUpdatedAt={leaderboardUpdatedAt}
                  lastSyncAt={lastSyncAt}
                />
                <ProjectRoute
                  projects={projects}
                  projectById={projectById}
                  onSelectStep={handleSelectStep}
                  onUpdatePrompt={handleUpdatePrompt}
                  onSubmitResponse={handleSubmitResponse}
                  onAddCustomStep={handleAddCustomStep}
                  onOverrideModel={handleOverrideModel}
                  leaderboardUpdatedAt={leaderboardUpdatedAt}
                />
              </div>
            ) : (
              <Navigate to="/onboard" replace />
            )
          }
        />
        <Route
          path="/app/settings"
          element={
            authState.onboarded ? (
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  projects={projects}
                  onNewProject={() => setShowModal(true)}
                  onOpenMemory={() => setShowMemoryPanel(true)}
                  syncStatus={syncStatus}
                  leaderboardUpdatedAt={leaderboardUpdatedAt}
                  lastSyncAt={lastSyncAt}
                />
                <Settings
                  authState={authState}
                  apiKey={authState.apiKey}
                  onDisconnectDrive={() =>
                    setAuthStateLocal((prev) => ({ ...prev, driveConnected: false }))
                  }
                  onSaveApiKey={handleSaveApiKey}
                  modelPrefs={modelPrefs}
                  onToggleModel={handleToggleModel}
                />
              </div>
            ) : (
              <Navigate to="/onboard" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const ProjectRoute = ({
  projects,
  projectById,
  onSelectStep,
  onUpdatePrompt,
  onSubmitResponse,
  onAddCustomStep,
  onOverrideModel,
  leaderboardUpdatedAt
}) => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const project = projectById[projectId];

  useEffect(() => {
    if (!project && projects.length) {
      navigate('/app');
    }
  }, [project, projects, navigate]);

  if (!project) {
    return null;
  }

  return (
    <ProjectDetail
      project={project}
      onSelectStep={onSelectStep}
      onUpdatePrompt={onUpdatePrompt}
      onSubmitResponse={onSubmitResponse}
      onAddCustomStep={onAddCustomStep}
      onOverrideModel={onOverrideModel}
      leaderboardUpdatedAt={leaderboardUpdatedAt}
    />
  );
};

export default App;
