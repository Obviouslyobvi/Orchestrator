const AUTH_KEY = 'orchestrator-auth';

export const getAuthState = () => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) {
    return { driveConnected: false, apiKey: '', onboarded: false };
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    return { driveConnected: false, apiKey: '', onboarded: false };
  }
};

export const setAuthState = (state) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
};
