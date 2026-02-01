import { taskBenchmarks } from './benchmarkTranslation';

const normalizeName = (name = '') => name.toLowerCase();

const modelAliases = {
  chatgpt: 'ChatGPT',
  'gpt-4o': 'ChatGPT',
  'gpt-4': 'ChatGPT',
  claude: 'Claude',
  'claude-3': 'Claude',
  'claude-3.5': 'Claude',
  gemini: 'Gemini',
  'gemini-1.5': 'Gemini',
  deepseek: 'DeepSeek',
  grok: 'Grok',
  perplexity: 'Perplexity'
};

const normalizeModel = (modelName = '') => {
  const key = normalizeName(modelName);
  return modelAliases[key] || modelName;
};

const calculateWeightedScore = (model, indexes) => {
  const totalWeight = indexes.reduce((sum, item) => sum + item.weight, 0);
  return indexes.reduce((sum, item) => {
    const value = Number(model[item.key]) || 0;
    return sum + value * item.weight;
  }, 0) / (totalWeight || 1);
};

export const pickBestModel = ({ taskType, rankings, excludedModels = [] }) => {
  if (taskType === 'Research / Fact-Finding') {
    return {
      model: 'Perplexity',
      score: 0,
      indexLabel: 'Perplexity Search',
      reason: 'Perplexity is always preferred for research because it includes live web search.'
    };
  }

  const benchmark = taskBenchmarks[taskType] || taskBenchmarks['Custom Step'];
  const available = rankings.models
    .map((model) => ({
      ...model,
      name: normalizeModel(model.name)
    }))
    .filter((model) => !excludedModels.includes(model.name));

  let best = null;
  available.forEach((model) => {
    const score = calculateWeightedScore(model, benchmark.indexes);
    if (!best || score > best.score) {
      best = { model: model.name, score };
    }
  });

  if (!best) {
    return {
      model: 'ChatGPT',
      score: 0,
      indexLabel: benchmark.label,
      reason: 'Defaulted to ChatGPT due to missing benchmark data.'
    };
  }

  return {
    model: best.model,
    score: Number(best.score.toFixed(1)),
    indexLabel: benchmark.label,
    reason: `${best.model} currently leads on the ${benchmark.label}.`
  };
};
