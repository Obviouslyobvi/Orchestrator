const steps = [
  {
    title: 'Start a project or task',
    description: 'Describe your goal and let the orchestrator set the workflow.'
  },
  {
    title: 'We check live rankings',
    description: 'Artificial Analysis benchmarks decide the best model per step.'
  },
  {
    title: 'Copy → paste → get response',
    description: 'You run the prompt in the right AI app and return with results.'
  },
  {
    title: 'Paste back to advance',
    description: 'Every response is logged, saved, and the next step is ready.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-semibold">How It Works</h2>
          <span className="text-sm text-muted">4-step guided workflow</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-semibold text-accent">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
