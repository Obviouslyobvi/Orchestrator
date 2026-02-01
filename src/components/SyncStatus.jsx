const SyncStatus = ({ status, lastSyncAt }) => {
  return (
    <div className="rounded-xl border border-border/60 bg-base/60 px-3 py-2 text-xs text-muted">
      <p className="text-white">Drive Sync: {status}</p>
      {lastSyncAt && (
        <p className="mt-1 text-[10px] text-muted">Last sync {lastSyncAt}</p>
      )}
    </div>
  );
};

export default SyncStatus;
