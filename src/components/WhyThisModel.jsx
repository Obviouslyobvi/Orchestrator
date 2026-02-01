const scoreTone = (score) => {
  if (score >= 85) {
    return 'bg-emerald-500/20 text-emerald-300';
  }
  if (score >= 80) {
    return 'bg-yellow-500/20 text-yellow-300';
  }
  return 'bg-red-500/20 text-red-300';
};

const WhyThisModel = ({ model, score, indexLabel, reason, updatedAt }) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-white">
          Why this model? <span className="text-muted">{reason}</span>
        </p>
        {score !== null && score !== undefined && (
          <span className={`rounded-full px-3 py-1 text-xs ${scoreTone(score)}`}>
            {indexLabel}: {score}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">Rankings last updated {updatedAt}</p>
      <p className="mt-2 text-xs text-muted">
        Open {model} to run the prompt below.
      </p>
    </div>
  );
};

export default WhyThisModel;
