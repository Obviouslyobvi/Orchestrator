import { useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Download, PlusCircle, Sparkles } from 'lucide-react';
import {
  ConnectionStatus,
  DataBroker,
  DataBrokerInput,
  StatusOption
} from './types';
import {
  exportBrokersToCsv,
  loadBrokers,
  saveBrokers
} from './services/storageService';
import BrokerForm from './components/BrokerForm';
import BrokerList from './components/BrokerList';
import BulkEditModal from './components/BulkEditModal';
import ExportModal from './components/ExportModal';
import ResearchAssistant from './components/ResearchAssistant';
import StatsCard from './components/StatsCard';

const statusOptions: StatusOption[] = [
  { value: ConnectionStatus.NOT_CONTACTED, label: 'Not Contacted' },
  { value: ConnectionStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ConnectionStatus.PARTNERED, label: 'Partnered' },
  { value: ConnectionStatus.CLOSED, label: 'Closed' }
];

const createEmptyBroker = (): DataBrokerInput => ({
  companyName: '',
  ceoName: '',
  title: '',
  industry: '',
  address: '',
  phone: '',
  email: '',
  linkedin: '',
  companyLinkedin: '',
  website: '',
  additionalContacts: '',
  companySize: '',
  dataProducts: '',
  status: ConnectionStatus.NOT_CONTACTED,
  notes: '',
  lastContact: '',
  nextFollowup: ''
});

const App = () => {
  const [brokers, setBrokers] = useState<DataBroker[]>(() => loadBrokers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ConnectionStatus | 'all'>(
    'all'
  );
  const [followupOnly, setFollowupOnly] = useState(false);
  const [sortKey, setSortKey] = useState<keyof DataBroker>('dateAdded');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBroker, setEditingBroker] = useState<DataBroker | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showResearch, setShowResearch] = useState(false);

  const persistBrokers = (next: DataBroker[]) => {
    setBrokers(next);
    saveBrokers(next);
  };

  const stats = useMemo(() => {
    const total = brokers.length;
    const byStatus = statusOptions.reduce<Record<string, number>>(
      (acc, option) => {
        acc[option.value] = brokers.filter(
          (broker) => broker.status === option.value
        ).length;
        return acc;
      },
      {}
    );
    return { total, byStatus };
  }, [brokers]);

  const filteredBrokers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    let data = [...brokers];
    if (statusFilter !== 'all') {
      data = data.filter((broker) => broker.status === statusFilter);
    }
    if (followupOnly) {
      const now = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      data = data.filter((broker) => {
        if (!broker.nextFollowup) {
          return false;
        }
        const next = new Date(broker.nextFollowup);
        return next >= now && next <= weekFromNow;
      });
    }
    if (normalizedQuery) {
      data = data.filter((broker) => {
        const value = Object.values(broker)
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return value.includes(normalizedQuery);
      });
    }
    data.sort((a, b) => {
      const aValue = String(a[sortKey] ?? '');
      const bValue = String(b[sortKey] ?? '');
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    return data;
  }, [brokers, followupOnly, searchQuery, sortDirection, sortKey, statusFilter]);

  const handleSaveBroker = (input: DataBrokerInput) => {
    if (editingBroker) {
      const next = brokers.map((broker) =>
        broker.id === editingBroker.id
          ? {
              ...broker,
              ...input,
              lastModified: new Date().toISOString()
            }
          : broker
      );
      persistBrokers(next);
      toast.success('Broker updated');
    } else {
      const now = new Date().toISOString();
      const newBroker: DataBroker = {
        id: crypto.randomUUID(),
        ...input,
        dateAdded: now,
        lastModified: now
      };
      persistBrokers([newBroker, ...brokers]);
      toast.success('Broker added');
    }
    setShowForm(false);
    setEditingBroker(null);
  };

  const handleDeleteBroker = (id: string) => {
    const next = brokers.filter((broker) => broker.id !== id);
    persistBrokers(next);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    toast.success('Broker removed');
  };

  const handleBulkUpdate = (status: ConnectionStatus) => {
    const next = brokers.map((broker) =>
      selectedIds.includes(broker.id)
        ? { ...broker, status, lastModified: new Date().toISOString() }
        : broker
    );
    persistBrokers(next);
    toast.success('Statuses updated');
    setSelectedIds([]);
    setShowBulkModal(false);
  };

  const handleExport = (mode: 'all' | 'filtered') => {
    const data = mode === 'all' ? brokers : filteredBrokers;
    const csv = exportBrokersToCsv(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-brokers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-base text-white">
      <Toaster position="top-right" />
      <header className="border-b border-border bg-surface/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-sm text-muted">California Data Brokers</p>
            <h1 className="text-2xl font-semibold">
              Prospecting Database Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-white hover:border-accent/70"
              onClick={() => setShowResearch(true)}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Research Assistant
              </span>
            </button>
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-white hover:border-accent/70"
              onClick={() => setShowExportModal(true)}
            >
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </span>
            </button>
            <button
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-base"
              onClick={() => {
                setEditingBroker(null);
                setShowForm(true);
              }}
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Broker
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-4">
          <StatsCard title="Total Brokers" value={stats.total} />
          {statusOptions.map((option) => (
            <StatsCard
              key={option.value}
              title={option.label}
              value={stats.byStatus[option.value] ?? 0}
            />
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase text-muted">
                Search
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
                placeholder="Search company, contact, or notes..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted">
                Status
              </label>
              <select
                className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ConnectionStatus | 'all')
                }
              >
                <option value="all">All statuses</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted">
                Sort by
              </label>
              <select
                className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
                value={sortKey}
                onChange={(event) =>
                  setSortKey(event.target.value as keyof DataBroker)
                }
              >
                <option value="dateAdded">Date added</option>
                <option value="companyName">Company name</option>
                <option value="ceoName">CEO / Key contact</option>
                <option value="status">Status</option>
                <option value="nextFollowup">Next follow-up</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted">
                Direction
              </label>
              <select
                className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
                value={sortDirection}
                onChange={(event) =>
                  setSortDirection(event.target.value as 'asc' | 'desc')
                }
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="followup-only"
                type="checkbox"
                checked={followupOnly}
                onChange={(event) => setFollowupOnly(event.target.checked)}
                className="h-4 w-4 rounded border-border bg-base text-accent"
              />
              <label
                htmlFor="followup-only"
                className="text-sm text-muted"
              >
                Follow-ups this week
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{filteredBrokers.length} records</span>
            {selectedIds.length > 0 && (
              <button
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-white"
                onClick={() => setShowBulkModal(true)}
              >
                Bulk update ({selectedIds.length})
              </button>
            )}
            {selectedIds.length > 0 && (
              <button
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-white"
                onClick={() => setSelectedIds([])}
              >
                Clear selection
              </button>
            )}
          </div>
        </section>

        <BrokerList
          brokers={filteredBrokers}
          selectedIds={selectedIds}
          onSelect={(next) => setSelectedIds(next)}
          onEdit={(broker) => {
            setEditingBroker(broker);
            setShowForm(true);
          }}
          onDelete={handleDeleteBroker}
        />
      </main>

      {showForm && (
        <BrokerForm
          initialData={editingBroker ?? createEmptyBroker()}
          statusOptions={statusOptions}
          onCancel={() => {
            setShowForm(false);
            setEditingBroker(null);
          }}
          onSave={handleSaveBroker}
        />
      )}

      {showBulkModal && (
        <BulkEditModal
          statusOptions={statusOptions}
          onClose={() => setShowBulkModal(false)}
          onConfirm={handleBulkUpdate}
        />
      )}

      {showExportModal && (
        <ExportModal
          totalCount={brokers.length}
          filteredCount={filteredBrokers.length}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      )}

      {showResearch && (
        <ResearchAssistant onClose={() => setShowResearch(false)} />
      )}
    </div>
  );
};

export default App;
