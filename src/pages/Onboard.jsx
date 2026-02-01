import { useState } from 'react';

const Onboard = ({ authState, onConnectDrive, onSaveApiKey, onSkip }) => {
  const [apiKey, setApiKey] = useState(authState.apiKey || '');

  return (
    <div className="min-h-screen bg-base px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="rounded-3xl border border-border bg-surface p-8">
          <h1 className="text-3xl font-semibold">Welcome to AI Orchestrator</h1>
          <p className="mt-2 text-sm text-muted">
            Connect Google Drive so your projects and memory sync across devices.
          </p>
          <button
            onClick={onConnectDrive}
            className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black"
          >
            {authState.driveConnected ? 'Drive Connected' : 'Connect Google Drive'}
          </button>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8">
          <h2 className="text-2xl font-semibold">Add Artificial Analysis API Key</h2>
          <p className="mt-2 text-sm text-muted">
            This lets the app pull live benchmark data to recommend the best model.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-muted">
            <li>Go to artificialanalysis.ai</li>
            <li>Create a free account</li>
            <li>Generate an API key</li>
            <li>Paste it here</li>
          </ol>
          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            className="mt-4 w-full rounded-xl border border-border bg-base px-4 py-3 text-sm"
            placeholder="Paste your API key"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onSaveApiKey(apiKey)}
              className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-black"
            >
              Save and Continue
            </button>
            <button
              onClick={onSkip}
              className="rounded-full border border-border px-6 py-2 text-sm text-muted"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
