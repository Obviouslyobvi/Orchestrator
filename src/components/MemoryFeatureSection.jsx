const MemoryFeatureSection = () => {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-surface p-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">
              The App Remembers Everything
            </p>
            <h2 className="text-3xl font-semibold">
              Your context follows every prompt automatically.
            </h2>
            <p className="text-sm text-muted">
              Save preferences, decisions, and reusable snippets once. The orchestrator
              injects them into every prompt so you never re-explain yourself.
            </p>
          </div>
          <div className="space-y-4 text-sm text-muted">
            <div className="rounded-2xl border border-border bg-base p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
                Preference
              </p>
              <p className="mt-2 text-sm text-white">Keep responses concise and skimmable.</p>
            </div>
            <div className="rounded-2xl border border-border bg-base p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Decision</p>
              <p className="mt-2 text-sm text-white">
                Target audience: solo founders and indie hackers.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-base p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Snippet</p>
              <p className="mt-2 text-sm text-white">Brand voice: confident, modern, helpful.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoryFeatureSection;
