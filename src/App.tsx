import { useMemo, useRef, useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  Download,
  Laptop,
  Moon,
  PlusCircle,
  Sparkles,
  Upload,
  Sun
} from 'lucide-react';
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
import CsvImportModal from './components/CsvImportModal';
import ExportModal from './components/ExportModal';
import ResearchAssistant from './components/ResearchAssistant';
import StatsCard from './components/StatsCard';

const statusOptions: StatusOption[] = [
  { value: ConnectionStatus.NOT_CONTACTED, label: 'Not Contacted' },
  { value: ConnectionStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ConnectionStatus.PARTNERED, label: 'Partnered' },
  { value: ConnectionStatus.CLOSED, label: 'Closed' }
];

type ThemeMode = 'light' | 'dark' | 'system';
type CsvData = { headers: string[]; rows: string[][] };

const THEME_STORAGE_KEY = 'ca-data-brokers-theme';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
  return stored ?? 'system';
};

const createEmptyBroker = (): DataBrokerInput => ({
  companyName: '',
  primaryContact: '',
  contactRole: '',
  industry: '',
  address: '',
  phone: '',
  email: '',
  linkedin: '',
  companyLinkedin: '',
  website: '',
  additionalContacts: [],
  companySize: '',
  dataProducts: '',
  status: ConnectionStatus.NOT_CONTACTED,
  notes: '',
  lastContact: '',
  nextFollowup: ''
});

const importFields = [
  { value: 'companyName', label: 'Company Name' },
  { value: 'primaryContact', label: 'Primary Contact' },
  { value: 'contactRole', label: 'Contact Role' },
  { value: 'industry', label: 'Industry' },
  { value: 'address', label: 'Company Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
  { value: 'linkedin', label: 'LinkedIn Profile URL' },
  { value: 'companyLinkedin', label: 'Company LinkedIn Page' },
  { value: 'website', label: 'Company Website' },
  { value: 'additionalContacts', label: 'Additional Contacts' },
  { value: 'companySize', label: 'Company Size/Revenue' },
  { value: 'dataProducts', label: 'Data Products They Buy' },
  { value: 'status', label: 'Connection Status' },
  { value: 'notes', label: 'Notes' },
  { value: 'lastContact', label: 'Last Contact Date' },
  { value: 'nextFollowup', label: 'Next Follow-up Date' }
];

const parseCsv = (content: string) => {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  const pushValue = () => {
    row.push(current);
    current = '';
  };

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      pushValue();
      if (row.some((value) => value.trim() !== '')) {
        rows.push(row);
      }
      row = [];
      continue;
    }
    if (!inQuotes && char === ',') {
      pushValue();
      continue;
    }
    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    pushValue();
    if (row.some((value) => value.trim() !== '')) {
      rows.push(row);
    }
  }

  const [headerRow, ...dataRows] = rows;
  if (!headerRow) {
    return { headers: [], rows: [] };
  }

  return {
    headers: headerRow.map((value) => value.trim()),
    rows: dataRows
  };
};

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
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialTheme());
  const [importError, setImportError] = useState<string | null>(null);
  const [importData, setImportData] = useState<CsvData | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (mode: ThemeMode) => {
      root.classList.remove('theme-light', 'theme-dark');
      if (mode === 'light') {
        root.classList.add('theme-light');
        return;
      }
      if (mode === 'dark') {
        root.classList.add('theme-dark');
        return;
      }
      root.classList.add(mediaQuery.matches ? 'theme-dark' : 'theme-light');
    };

    applyTheme(themeMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    if (themeMode !== 'system') {
      return undefined;
    }

    const handleChange = () => applyTheme('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

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
        const values = Object.values(broker).flatMap((value) => {
          if (!value) {
            return [];
          }
          if (Array.isArray(value)) {
            return value.flatMap((contact) =>
              Object.values(contact).filter(Boolean)
            );
          }
          return value;
        });
        const searchable = values.join(' ').toLowerCase();
        return searchable.includes(normalizedQuery);
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

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const parseStatus = (value: string) => {
    const normalized = value.trim().toLowerCase();
    const match = statusOptions.find(
      (option) => option.value.toLowerCase() === normalized
    );
    return match?.value ?? ConnectionStatus.NOT_CONTACTED;
  };

  const parseAdditionalContacts = (value: string) => {
    if (!value.trim()) {
      return [];
    }
    return value.split(';').map((entry) => {
      const [name, role, email, phone, linkedin] = entry
        .split('|')
        .map((item) => item.trim());
      return {
        id: crypto.randomUUID(),
        name: name || 'Unknown',
        role,
        email,
        phone,
        linkedin
      };
    });
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    event.target.value = '';
    try {
      const content = await file.text();
      const parsed = parseCsv(content);
      if (parsed.headers.length === 0) {
        throw new Error('CSV file is empty or missing headers.');
      }
      if (parsed.rows.length === 0) {
        throw new Error('CSV file has no data rows.');
      }
      setImportData(parsed);
      setShowImportModal(true);
      setImportError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'CSV import failed. Check the file format.';
      setImportError(message);
      toast.error(message);
    }
  };

  const handleImportConfirm = (
    mapping: Record<string, string>,
    rows: string[][]
  ) => {
    const requiredFields = ['companyName', 'primaryContact'];
    const missingRequired = requiredFields.filter(
      (field) => !mapping[field]
    );
    if (missingRequired.length > 0) {
      setImportError(
        `Map required fields: ${missingRequired
          .map((field) =>
            field === 'primaryContact' ? 'Primary Contact' : 'Company Name'
          )
          .join(', ')}.`
      );
      return;
    }

    const now = new Date().toISOString();
    const imported: DataBroker[] = [];
    const rowErrors: string[] = [];

    rows.forEach((rowValues, index) => {
      const rowData: Record<string, string> = {};
      Object.entries(mapping).forEach(([field, header]) => {
        const headerIndex = importData?.headers.indexOf(header) ?? -1;
        if (headerIndex >= 0) {
          rowData[field] = rowValues[headerIndex]?.trim() ?? '';
        }
      });

      if (!rowData.companyName || !rowData.primaryContact) {
        rowErrors.push(
          `Row ${index + 2}: Company Name and Primary Contact are required.`
        );
        return;
      }

      const brokerInput: DataBrokerInput = {
        ...createEmptyBroker(),
        ...rowData,
        status: rowData.status
          ? parseStatus(rowData.status)
          : ConnectionStatus.NOT_CONTACTED,
        additionalContacts: rowData.additionalContacts
          ? parseAdditionalContacts(rowData.additionalContacts)
          : []
      };

      imported.push({
        id: crypto.randomUUID(),
        ...brokerInput,
        dateAdded: now,
        lastModified: now
      });
    });

    if (rowErrors.length > 0) {
      setImportError(rowErrors.slice(0, 3).join(' '));
    }

    if (imported.length === 0) {
      setImportError('No valid rows found to import.');
      return;
    }

    persistBrokers([...imported, ...brokers]);
    toast.success(`Imported ${imported.length} brokers`);
    setShowImportModal(false);
    setImportData(null);
    setImportError(null);
  };

  return (
    <div className="min-h-screen bg-base text-content">
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
            <div className="flex items-center gap-1 rounded-lg border border-border bg-base p-1">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Laptop, label: 'System' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
                    themeMode === value ? 'bg-surface shadow-soft' : 'text-muted'
                  }`}
                  onClick={() => setThemeMode(value as ThemeMode)}
                  aria-pressed={themeMode === value}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-content hover:border-accent/70"
              onClick={() => setShowResearch(true)}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Research Assistant
              </span>
            </button>
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-content hover:border-accent/70"
              onClick={() => setShowExportModal(true)}
            >
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </span>
            </button>
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-content hover:border-accent/70"
              onClick={handleImportClick}
            >
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import CSV
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportFile}
            />
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
                <option value="primaryContact">Primary contact</option>
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
          {importError && (
            <div className="mt-4 rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200">
              {importError}
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{filteredBrokers.length} records</span>
            {selectedIds.length > 0 && (
              <button
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-content"
                onClick={() => setShowBulkModal(true)}
              >
                Bulk update ({selectedIds.length})
              </button>
            )}
            {selectedIds.length > 0 && (
              <button
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-content"
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

      {showImportModal && importData && (
        <CsvImportModal
          headers={importData.headers}
          rows={importData.rows}
          fields={importFields}
          onClose={() => {
            setShowImportModal(false);
            setImportData(null);
          }}
          onConfirm={handleImportConfirm}
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
