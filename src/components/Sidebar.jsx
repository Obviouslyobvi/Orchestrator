import { Link, useLocation } from 'react-router-dom';
import SyncStatus from './SyncStatus';

const statusStyles = {
  'In Progress': 'bg-blue-500/20 text-blue-300',
  Paused: 'bg-yellow-500/20 text-yellow-200',
  Done: 'bg-emerald-500/20 text-emerald-300'
};

const Sidebar = ({
  projects,
  onNewProject,
  onOpenMemory,
  syncStatus,
  leaderboardUpdatedAt,
  lastSyncAt
}) => {
  const location = useLocation();

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface/60 p-6 md:w-64">
      <Link to="/" className="text-lg font-semibold">
        OrchestrateAI
      </Link>
      <button
        onClick={onNewProject}
        className="mt-6 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black"
      >
        New Project
      </button>
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
          Projects
        </p>
        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/app/project/${project.id}`}
              className={`flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm transition hover:border-accent ${
                location.pathname.includes(project.id)
                  ? 'bg-base text-white'
                  : 'text-muted'
              }`}
            >
              <span className="truncate">{project.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  statusStyles[project.status] || 'bg-white/10 text-muted'
                }`}
              >
                {project.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
          Favorites
        </p>
        <div className="space-y-2 text-sm text-muted">
          {projects
            .filter((project) => project.favorite)
            .map((project) => (
              <Link
                key={project.id}
                to={`/app/project/${project.id}`}
                className="block truncate rounded-lg px-2 py-1 hover:text-white"
              >
                ★ {project.name}
              </Link>
            ))}
          {projects.filter((project) => project.favorite).length === 0 && (
            <span className="text-xs text-muted">Pin a project to see it here.</span>
          )}
        </div>
      </div>
      <div className="mt-8 space-y-3 text-sm text-muted">
        <button onClick={onOpenMemory} className="text-left hover:text-white">
          Memory
        </button>
        <Link to="/app/settings" className="hover:text-white">
          Settings
        </Link>
      </div>
      <div className="mt-auto space-y-3 pt-6 text-xs text-muted">
        <SyncStatus status={syncStatus} lastSyncAt={lastSyncAt} />
        <div className="rounded-xl border border-border/60 bg-base/60 px-3 py-2">
          Rankings: {leaderboardUpdatedAt}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
