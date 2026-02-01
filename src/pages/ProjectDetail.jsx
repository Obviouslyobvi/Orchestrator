import { useMemo, useState } from 'react';
import StepList from '../components/StepList';
import ActiveStep from '../components/ActiveStep';
import ModelBadge from '../components/ModelBadge';
import { modelBadgeColors } from '../logic/modelRouting';

const statusStyles = {
  'In Progress': 'border-blue-500/40 bg-blue-500/20 text-blue-300',
  Paused: 'border-yellow-500/40 bg-yellow-500/20 text-yellow-200',
  Done: 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
};

const ProjectDetail = ({
  project,
  onSelectStep,
  onUpdatePrompt,
  onSubmitResponse,
  onAddCustomStep,
  onOverrideModel,
  leaderboardUpdatedAt
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customModel, setCustomModel] = useState('ChatGPT');

  const activeStep = useMemo(() => {
    return (
      project.steps.find((step) => step.id === project.activeStepId) ||
      project.steps[0]
    );
  }, [project]);

  const previousResponses = useMemo(() => {
    return project.steps
      .filter((step) => step.response)
      .map((step) => ({
        stepId: step.id,
        title: step.title,
        response: step.response
      }));
  }, [project.steps]);

  const handleAddStep = () => {
    if (!customTitle.trim()) {
      return;
    }
    onAddCustomStep(project.id, {
      title: customTitle.trim(),
      model: customModel
    });
    setCustomTitle('');
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-muted">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              statusStyles[project.status] || 'border-border bg-white/10 text-muted'
            }`}
          >
            {project.status}
          </span>
          <button className="rounded-full border border-border px-3 py-1 text-xs text-muted">
            •••
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <StepList
          steps={project.steps}
          activeStepId={activeStep.id}
          onSelectStep={(id) => onSelectStep(project.id, id)}
        />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <ActiveStep
            step={activeStep}
            onUpdatePrompt={(stepId, prompt) =>
              onUpdatePrompt(project.id, stepId, prompt)
            }
            onSubmitResponse={(stepId, response) =>
              onSubmitResponse(project.id, stepId, response)
            }
            onOverrideModel={(stepId, model) =>
              onOverrideModel(project.id, stepId, model)
            }
            previousResponses={previousResponses}
            leaderboardUpdatedAt={leaderboardUpdatedAt}
          />
          <div className="border-t border-border bg-surface/60 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Add Custom Step</h3>
              <ModelBadge model={customModel} size="sm" />
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
                placeholder="Step title"
                className="flex-1 rounded-xl border border-border bg-base px-4 py-3 text-sm"
              />
              <select
                value={customModel}
                onChange={(event) => setCustomModel(event.target.value)}
                className="rounded-xl border border-border bg-base px-4 py-3 text-sm"
              >
                {Object.keys(modelBadgeColors).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStep}
                className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black"
              >
                Add Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
