import { Link } from 'react-router-dom';

const Dashboard = ({ projects, onNewProject }) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Choose a project or start a new workflow to begin orchestrating.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={onNewProject}
            className="rounded-2xl border border-accent bg-accent/10 p-6 text-left text-sm font-semibold text-accent"
          >
            + Start a New Project
            <p className="mt-2 text-xs font-normal text-muted">
              Create a new workflow and let the app route the right AI models.
            </p>
          </button>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Recent Activity
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {projects.slice(0, 3).map((project) => (
                <li key={project.id} className="flex items-center justify-between">
                  <span className="truncate">{project.name}</span>
                  <Link
                    to={`/app/project/${project.id}`}
                    className="text-accent"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
