import { ConnectionStatus, StatusOption } from '../types';

interface BulkEditModalProps {
  statusOptions: StatusOption[];
  onClose: () => void;
  onConfirm: (status: ConnectionStatus) => void;
}

const BulkEditModal = ({
  statusOptions,
  onClose,
  onConfirm
}: BulkEditModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div>
          <h3 className="text-lg font-semibold">Bulk status update</h3>
          <p className="text-sm text-muted">
            Apply a new connection status to all selected brokers.
          </p>
        </div>
        <div className="grid gap-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className="rounded-lg border border-border px-4 py-2 text-left text-sm font-semibold text-content hover:border-accent"
              onClick={() => onConfirm(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          className="text-sm text-muted hover:text-content"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BulkEditModal;
