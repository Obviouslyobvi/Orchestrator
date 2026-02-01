import { useEffect, useMemo, useState } from 'react';
import ModelBadge from './ModelBadge';
import WhyThisModel from './WhyThisModel';
import { modelBadgeColors } from '../logic/modelRouting';

const ActiveStep = ({
  step,
  onUpdatePrompt,
  onSubmitResponse,
  onOverrideModel,
  previousResponses,
  leaderboardUpdatedAt
}) => {
  const [prompt, setPrompt] = useState(step.prompt);
  const [response, setResponse] = useState(step.response || '');
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setPrompt(step.prompt);
    setResponse(step.response || '');
  }, [step]);

  const instructionLine = useMemo(() => {
    return `Open ${step.model} → Paste the prompt → Come back and paste the response below.`;
  }, [step.model]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{step.title}</h2>
          <p className="mt-2 text-sm text-muted">Task type: {step.taskType}</p>
        </div>
        <ModelBadge model={step.model} score={step.score} />
      </div>

      <WhyThisModel
        model={step.model}
        score={step.score}
        indexLabel={step.indexLabel}
        reason={step.reason}
        updatedAt={leaderboardUpdatedAt}
      />

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Prompt</h3>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={step.model}
              onChange={(event) => onOverrideModel(step.id, event.target.value)}
              className="rounded-full border border-border bg-base px-3 py-1 text-xs"
            >
              {Object.keys(modelBadgeColors).map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <button
              onClick={handleCopy}
              className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black"
            >
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            onUpdatePrompt(step.id, event.target.value);
          }}
          className="h-40 w-full resize-none rounded-xl border border-border bg-base p-4 text-sm text-white outline-none"
        />
        <p className="mt-3 text-xs text-muted">{instructionLine}</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Paste Response Here</h3>
          <button
            onClick={() => onSubmitResponse(step.id, response)}
            className="rounded-full border border-accent px-4 py-2 text-xs font-semibold text-accent"
          >
            Submit Response
          </button>
        </div>
        <textarea
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Paste the AI's response here..."
          className="h-40 w-full resize-none rounded-xl border border-border bg-base p-4 text-sm text-white outline-none"
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="flex w-full items-center justify-between text-sm font-semibold"
        >
          Previous Responses
          <span className="text-muted">{showHistory ? '–' : '+'}</span>
        </button>
        {showHistory && (
          <div className="mt-4 space-y-3 text-sm text-muted">
            {previousResponses.length === 0 && (
              <p>No previous responses yet. Complete a step to log it here.</p>
            )}
            {previousResponses.map((entry) => (
              <div
                key={entry.stepId}
                className="rounded-xl border border-border/60 bg-base p-3"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  {entry.title}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-white">
                  {entry.response}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveStep;
