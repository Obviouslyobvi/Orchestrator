const LiveRankingsSection = () => {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-accent/80">
            Always Up to Date
          </p>
          <h2 className="text-3xl font-semibold">
            Live benchmarks keep your model picks sharp.
          </h2>
          <p className="text-sm text-muted">
            We pull real-time rankings from Artificial Analysis every hour so your workflow
            stays aligned with the fastest-moving AI leaderboard.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Top Writing Model
              </p>
              <h3 className="mt-2 text-lg font-semibold">Claude 3.5</h3>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
              87.4
            </span>
          </div>
          <p className="mt-4 text-xs text-muted">Updated 12 minutes ago</p>
        </div>
      </div>
    </section>
  );
};

export default LiveRankingsSection;
