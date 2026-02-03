import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { requestResearch } from '../services/geminiService';

interface ResearchAssistantProps {
  onClose: () => void;
}

const ResearchAssistant = ({ onClose }: ResearchAssistantProps) => {
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResearch = async () => {
    setErrorMessage('');
    setResult('');
    if (!companyName.trim()) {
      setErrorMessage('Enter a company name to research.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await requestResearch(companyName.trim());
      setResult(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Research request failed. Try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-2xl space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Research Assistant</h3>
            <p className="text-sm text-muted">
              Use Gemini to discover likely decision-makers and contact clues.
            </p>
          </div>
          <button
            className="text-sm text-muted hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-lg border border-border bg-base px-3 py-2 text-sm"
            placeholder="Enter a company name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <button
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-base disabled:opacity-60"
            onClick={handleResearch}
            disabled={isLoading}
          >
            {isLoading ? 'Researching...' : 'Generate insights'}
          </button>
        </div>
        {errorMessage && (
          <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200">
            {errorMessage}
          </p>
        )}
        {result && (
          <div className="rounded-lg border border-border bg-base p-4 text-sm leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        )}
        <p className="text-xs text-muted">
          Ensure your <code className="text-white">VITE_GEMINI_API_KEY</code> is
          set in <code className="text-white">.env.local</code> to enable live
          research.
        </p>
      </div>
    </div>
  );
};

export default ResearchAssistant;
