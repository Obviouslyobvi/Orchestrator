interface ExportModalProps {
  totalCount: number;
  filteredCount: number;
  onClose: () => void;
  onExport: (mode: 'all' | 'filtered') => void;
}

const ExportModal = ({
  totalCount,
  filteredCount,
  onClose,
  onExport
}: ExportModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div>
          <h3 className="text-lg font-semibold">Export records</h3>
          <p className="text-sm text-muted">
            Download your broker list as a CSV file for email campaigns or
            backups.
          </p>
        </div>
        <div className="space-y-3">
          <button
            className="w-full rounded-lg border border-border px-4 py-2 text-left text-sm font-semibold text-content hover:border-accent"
            onClick={() => onExport('all')}
          >
            Export all brokers ({totalCount})
          </button>
          <button
            className="w-full rounded-lg border border-border px-4 py-2 text-left text-sm font-semibold text-content hover:border-accent"
            onClick={() => onExport('filtered')}
          >
            Export current filters ({filteredCount})
          </button>
        </div>
        <button
          className="text-sm text-muted hover:text-content"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
