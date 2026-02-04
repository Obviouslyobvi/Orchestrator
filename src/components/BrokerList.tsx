import { format } from 'date-fns';
import { DataBroker } from '../types';

interface BrokerListProps {
  brokers: DataBroker[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onEdit: (broker: DataBroker) => void;
  onDelete: (id: string) => void;
}

const BrokerList = ({
  brokers,
  selectedIds,
  onSelect,
  onEdit,
  onDelete
}: BrokerListProps) => {
  const toggleAll = (checked: boolean) => {
    onSelect(checked ? brokers.map((broker) => broker.id) : []);
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((item) => item !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-base/60 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-base text-accent"
                  checked={
                    brokers.length > 0 && selectedIds.length === brokers.length
                  }
                  onChange={(event) => toggleAll(event.target.checked)}
                />
              </th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Primary Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Next Follow-up</th>
              <th className="px-4 py-3">Contact Details</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brokers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-muted">
                  No brokers found. Add a new record to get started.
                </td>
              </tr>
            )}
            {brokers.map((broker) => (
              <tr
                key={broker.id}
                className="border-t border-border/60 hover:bg-base/40"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-base text-accent"
                    checked={selectedIds.includes(broker.id)}
                    onChange={() => toggleOne(broker.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-content">
                    {broker.companyName}
                  </p>
                  <p className="text-xs text-muted">{broker.industry}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-content">
                    {broker.primaryContact}
                  </p>
                  <p className="text-xs text-muted">{broker.contactRole}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-content">
                    {broker.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-muted">
                  {broker.nextFollowup
                    ? format(new Date(broker.nextFollowup), 'MMM d, yyyy')
                    : 'Not scheduled'}
                </td>
                <td className="px-4 py-4 text-sm text-muted">
                  <div>{broker.email || '—'}</div>
                  <div>{broker.phone || '—'}</div>
                  <div className="truncate">{broker.website || '—'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <button
                      className="text-xs font-semibold text-accent hover:text-content"
                      onClick={() => onEdit(broker)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs font-semibold text-rose-400 hover:text-rose-200"
                      onClick={() => onDelete(broker.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BrokerList;
