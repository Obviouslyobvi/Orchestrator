import { Link } from 'react-router-dom';

const modelIcons = ['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'Grok', 'Perplexity'];

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-accent/80">
            Manual Multi-Model Workflow
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            One App. Every AI Model. Zero Guesswork.
          </h1>
          <p className="text-lg text-muted">
            Your AI orchestrator checks live benchmarks, picks the best model, builds the
            prompt, and keeps your projects organized — across every device.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/app"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black shadow-soft"
            >
              Start Orchestrating
            </Link>
            <button className="rounded-full border border-border px-6 py-3 text-sm text-muted transition hover:border-accent hover:text-white">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {modelIcons.map((model) => (
            <span
              key={model}
              className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-muted"
            >
              {model}
            </span>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/20 blur-[120px]" />
    </section>
  );
};

export default Hero;
