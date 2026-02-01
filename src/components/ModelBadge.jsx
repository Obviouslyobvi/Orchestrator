import { modelBadgeColors, modelIcons } from '../logic/modelRouting';

const sizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5'
};

const scoreTone = (score) => {
  if (score >= 85) {
    return 'bg-emerald-500/20 text-emerald-300';
  }
  if (score >= 80) {
    return 'bg-yellow-500/20 text-yellow-300';
  }
  return 'bg-red-500/20 text-red-300';
};

const ModelBadge = ({ model, size = 'md', score }) => {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${
        modelBadgeColors[model] || 'border-border bg-white/5 text-muted'
      } ${sizeStyles[size]}`}
    >
      <span>{modelIcons[model] || '●'}</span>
      {model}
      {score !== null && score !== undefined && (
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${scoreTone(score)}`}>
          {score}
        </span>
      )}
    </span>
  );
};

export default ModelBadge;
