import ModelBadge from './ModelBadge';

const statusIcons = {
  Pending: '○',
  Active: '●',
  Done: '✔'
};

const StepList = ({ steps, activeStepId, onSelectStep }) => {
  return (
    <div className="h-full border-r border-border bg-surface/50 p-4 md:w-72">
      <h3 className="mb-4 text-sm font-semibold text-white">Steps</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onSelectStep(step.id)}
            className={`w-full rounded-xl border px-3 py-3 text-left transition ${
              step.id === activeStepId
                ? 'border-accent bg-base text-white'
                : 'border-border text-muted hover:border-accent/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">
                Step {index + 1}
              </span>
              <span className="text-xs">{statusIcons[step.status]}</span>
            </div>
            <p className="mt-2 text-sm font-semibold">{step.title}</p>
            <div className="mt-2">
              <ModelBadge model={step.model} size="sm" score={step.score} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepList;
