const DRIVE_KEY = 'orchestrator-drive-store';

const readStore = () => {
  const stored = localStorage.getItem(DRIVE_KEY);
  if (!stored) {
    return {};
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    return {};
  }
};

const writeStore = (store) => {
  localStorage.setItem(DRIVE_KEY, JSON.stringify(store));
};

export const readDriveFile = (filename) => {
  const store = readStore();
  return store[filename] || null;
};

export const writeDriveFile = (filename, data) => {
  const store = readStore();
  store[filename] = data;
  writeStore(store);
};

export const listDriveFiles = () => {
  const store = readStore();
  return Object.keys(store);
};
