const CACHE_KEY = 'orchestrator-leaderboard-cache';
const CACHE_TTL = 60 * 60 * 1000;

const normalizeModels = (models) =>
  models
    .filter(Boolean)
    .map((model) => ({
      name: model.name || model.model_name || 'Unknown',
      intelligence_index: Number(model.artificial_analysis_intelligence_index) || 0,
      coding_index: Number(model.artificial_analysis_coding_index) || 0,
      math_index: Number(model.artificial_analysis_math_index) || 0,
      livecodebench: Number(model.livecodebench) || 0
    }));

export const getCachedLeaderboard = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) {
    return null;
  }
  try {
    return JSON.parse(cached);
  } catch (error) {
    return null;
  }
};

export const cacheLeaderboard = (payload) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
};

export const fetchLeaderboard = async ({ apiKey }) => {
  if (!apiKey) {
    throw new Error('Missing API key');
  }
  const response = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  const data = await response.json();
  return {
    updatedAt: new Date().toISOString(),
    models: normalizeModels(data?.data || data?.models || [])
  };
};

export const getLeaderboardData = async ({ apiKey, fallback }) => {
  const cached = getCachedLeaderboard();
  if (cached && Date.now() - new Date(cached.updatedAt).getTime() < CACHE_TTL) {
    return { source: 'cache', leaderboard: cached };
  }

  try {
    const leaderboard = await fetchLeaderboard({ apiKey });
    cacheLeaderboard(leaderboard);
    return { source: 'api', leaderboard };
  } catch (error) {
    if (cached) {
      return { source: 'cache', leaderboard: cached };
    }
    const fallbackData = {
      ...fallback,
      updatedAt: fallback.updatedAt || new Date().toISOString()
    };
    cacheLeaderboard(fallbackData);
    return { source: 'fallback', leaderboard: fallbackData };
  }
};
