import { useMemo, useState } from 'react';

interface FieldOption {
  value: string;
  label: string;
}

interface CsvImportModalProps {
  headers: string[];
  rows: string[][];
  fields: FieldOption[];
  onClose: () => void;
  onConfirm: (mapping: Record<string, string>, rows: string[][]) => void;
}

const CsvImportModal = ({
  headers,
  rows,
  fields,
  onClose,
  onConfirm
}: CsvImportModalProps) => {
  const [mapping, setMapping] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      const match = headers.find(
        (header) => header.toLowerCase() === field.value.toLowerCase()
      );
      initial[field.value] = match ?? '';
    });
    return initial;
  });

  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);

  const summary = useMemo(() => {
    const required = ['companyName', 'primaryContact'];
    const missingRequired = required.filter((field) => !mapping[field]);
    const mappedHeaders = Object.values(mapping).filter(Boolean);
    const validRows = rows.filter((row) => {
      const companyIndex = headers.indexOf(mapping.companyName || '');
      const contactIndex = headers.indexOf(mapping.primaryContact || '');
      if (companyIndex < 0 || contactIndex < 0) {
        return false;
      }
      return Boolean(row[companyIndex]?.trim()) && Boolean(row[contactIndex]?.trim());
    });
    return {
      missingRequired,
      mappedCount: mappedHeaders.length,
      totalRows: rows.length,
      validRows: validRows.length
    };
  }, [headers, mapping, rows]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-6 py-10">
      <div className="w-full max-w-5xl space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Map CSV fields</h3>
            <p className="text-sm text-muted">
              Match each CSV column to the DataBroker fields before importing.
            </p>
          </div>
          <button
            className="text-sm text-muted hover:text-content"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.value}
              className="flex flex-col gap-2 text-xs font-semibold uppercase text-muted"
            >
              {field.label}
              <select
                className="rounded-lg border border-border bg-base px-3 py-2 text-sm text-content"
                value={mapping[field.value]}
                onChange={(event) =>
                  setMapping((prev) => ({
                    ...prev,
                    [field.value]: event.target.value
                  }))
                }
              >
                <option value="">-- Not mapped --</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-base p-4 text-sm text-muted">
          <p className="font-semibold text-content">Import summary</p>
          <ul className="mt-2 space-y-1">
            <li>Total rows detected: {summary.totalRows}</li>
            <li>Rows with required fields: {summary.validRows}</li>
            <li>Mapped columns: {summary.mappedCount}</li>
          </ul>
          {summary.missingRequired.length > 0 && (
            <p className="mt-2 text-rose-300">
              Required mappings missing: {summary.missingRequired.join(', ')}.
            </p>
          )}
          <p className="mt-2 text-xs">
            For “Additional Contacts”, use this format per contact:
            <span className="font-semibold text-content">
              {' '}
              Name | Role | Email | Phone | LinkedIn
            </span>
            . Separate multiple contacts with semicolons.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-content">Preview</p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-surface text-muted">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="px-3 py-2">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-border/60">
                    {headers.map((header, columnIndex) => (
                      <td key={header} className="px-3 py-2 text-content">
                        {row[columnIndex]}
                      </td>
                    ))}
                  </tr>
                ))}
                {previewRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="px-3 py-6 text-center text-muted"
                    >
                      No rows to preview.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-content"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-base"
            onClick={() => onConfirm(mapping, rows)}
          >
            Import {summary.validRows} records
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvImportModal;
