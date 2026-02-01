const Settings = ({ authState, onDisconnectDrive, apiKey, onSaveApiKey, modelPrefs, onToggleModel }) => {
  const models = ['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Grok', 'Perplexity'];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Google Drive</h2>
          <p className="mt-2 text-sm text-muted">
            Connection status: {authState.driveConnected ? 'Connected' : 'Not connected'}
          </p>
          <button
            onClick={onDisconnectDrive}
            className="mt-4 rounded-full border border-border px-4 py-2 text-sm text-muted"
          >
            Disconnect
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Artificial Analysis</h2>
          <p className="mt-2 text-sm text-muted">
            API key is {apiKey ? 'configured' : 'missing'}.
          </p>
          <input
            value={apiKey}
            onChange={(event) => onSaveApiKey(event.target.value)}
            className="mt-4 w-full rounded-xl border border-border bg-base px-4 py-3 text-sm"
            placeholder="Paste API key"
          />
          <p className="mt-2 text-xs text-muted">We cache rankings hourly.</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Model Preferences</h2>
          <p className="mt-2 text-sm text-muted">
            Exclude models you do not have access to.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {models.map((model) => (
              <label
                key={model}
                className="flex items-center justify-between rounded-xl border border-border bg-base px-4 py-3 text-sm"
              >
                {model}
                <input
                  type="checkbox"
                  checked={!modelPrefs.excludedModels.includes(model)}
                  onChange={() => onToggleModel(model)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Memory</h2>
          <p className="mt-2 text-sm text-muted">
            Export or clear all memory items from your workspace.
          </p>
          <button className="mt-4 rounded-full border border-border px-4 py-2 text-sm text-muted">
            Clear Memory
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
