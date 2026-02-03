import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { DataBrokerInput, StatusOption } from '../types';

interface BrokerFormProps {
  initialData: DataBrokerInput;
  statusOptions: StatusOption[];
  onSave: (broker: DataBrokerInput) => void;
  onCancel: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const urlRegex = /^https?:\/\/.+/i;

const BrokerForm = ({
  initialData,
  statusOptions,
  onSave,
  onCancel
}: BrokerFormProps) => {
  const [formState, setFormState] = useState<DataBrokerInput>({
    ...initialData,
    additionalContacts: initialData.additionalContacts ?? []
  });

  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    if (!formState.companyName.trim()) {
      errors.companyName = 'Company name is required.';
    }
    if (!formState.primaryContact.trim()) {
      errors.primaryContact = 'Primary contact name is required.';
    }
    if (formState.email && !emailRegex.test(formState.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (formState.linkedin && !urlRegex.test(formState.linkedin)) {
      errors.linkedin = 'LinkedIn profile URL should start with http(s).';
    }
    if (formState.companyLinkedin && !urlRegex.test(formState.companyLinkedin)) {
      errors.companyLinkedin =
        'Company LinkedIn URL should start with http(s).';
    }
    if (formState.website && !urlRegex.test(formState.website)) {
      errors.website = 'Website URL should start with http(s).';
    }
    return errors;
  }, [formState]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.keys(validation).length > 0) {
      return;
    }
    onSave(formState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-6 py-10">
      <form
        className="w-full max-w-3xl space-y-6 rounded-2xl border border-border bg-surface p-8 shadow-soft"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Broker details</h2>
            <p className="text-sm text-muted">
              Capture key contact information and notes for outreach.
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-muted hover:text-content"
            onClick={onCancel}
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Company Name *
            </label>
            <input
              name="companyName"
              value={formState.companyName}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
            {validation.companyName && (
              <p className="mt-1 text-xs text-rose-400">
                {validation.companyName}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Primary Contact *
            </label>
            <input
              name="primaryContact"
              value={formState.primaryContact}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
            {validation.primaryContact && (
              <p className="mt-1 text-xs text-rose-400">
                {validation.primaryContact}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Contact Role
            </label>
            <input
              name="contactRole"
              value={formState.contactRole}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Industry / Vertical
            </label>
            <input
              name="industry"
              value={formState.industry}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Phone Number
            </label>
            <input
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Email Address
            </label>
            <input
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
            {validation.email && (
              <p className="mt-1 text-xs text-rose-400">
                {validation.email}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              LinkedIn Profile URL
            </label>
            <input
              name="linkedin"
              value={formState.linkedin}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
            {validation.linkedin && (
              <p className="mt-1 text-xs text-rose-400">
                {validation.linkedin}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Company Website
            </label>
            <input
              name="website"
              value={formState.website}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
            {validation.website && (
              <p className="mt-1 text-xs text-rose-400">
                {validation.website}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Company LinkedIn Page
            </label>
            <input
              name="companyLinkedin"
              value={formState.companyLinkedin}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
            {validation.companyLinkedin && (
              <p className="mt-1 text-xs text-rose-400">
                {validation.companyLinkedin}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Company Address
            </label>
            <input
              name="address"
              value={formState.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Company Size / Revenue
            </label>
            <input
              name="companySize"
              value={formState.companySize}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase text-muted">
              Data Products They Buy
            </label>
            <input
              name="dataProducts"
              value={formState.dataProducts}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Connection Status
            </label>
            <select
              name="status"
              value={formState.status}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  status: event.target.value as DataBrokerInput['status']
                }))
              }
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Last Contact Date
            </label>
            <input
              type="date"
              name="lastContact"
              value={formState.lastContact}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted">
              Next Follow-up Date
            </label>
            <input
              type="date"
              name="nextFollowup"
              value={formState.nextFollowup}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-muted">
                Additional Contacts
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-accent"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    additionalContacts: [
                      ...prev.additionalContacts,
                      {
                        id: crypto.randomUUID(),
                        name: '',
                        role: '',
                        email: '',
                        phone: '',
                        linkedin: ''
                      }
                    ]
                  }))
                }
              >
                + Add contact
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {formState.additionalContacts.length === 0 && (
                <p className="text-sm text-muted">
                  Add additional decision-makers and their contact details.
                </p>
              )}
              {formState.additionalContacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className="rounded-lg border border-border bg-base p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted">
                      Contact {index + 1}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-rose-400"
                      onClick={() =>
                        setFormState((prev) => ({
                          ...prev,
                          additionalContacts: prev.additionalContacts.filter(
                            (item) => item.id !== contact.id
                          )
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input
                      placeholder="Name"
                      value={contact.name}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          additionalContacts: prev.additionalContacts.map(
                            (item) =>
                              item.id === contact.id
                                ? { ...item, name: value }
                                : item
                          )
                        }));
                      }}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Role"
                      value={contact.role ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          additionalContacts: prev.additionalContacts.map(
                            (item) =>
                              item.id === contact.id
                                ? { ...item, role: value }
                                : item
                          )
                        }));
                      }}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Email"
                      value={contact.email ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          additionalContacts: prev.additionalContacts.map(
                            (item) =>
                              item.id === contact.id
                                ? { ...item, email: value }
                                : item
                          )
                        }));
                      }}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Phone"
                      value={contact.phone ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          additionalContacts: prev.additionalContacts.map(
                            (item) =>
                              item.id === contact.id
                                ? { ...item, phone: value }
                                : item
                          )
                        }));
                      }}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="LinkedIn URL"
                      value={contact.linkedin ?? ''}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormState((prev) => ({
                          ...prev,
                          additionalContacts: prev.additionalContacts.map(
                            (item) =>
                              item.id === contact.id
                                ? { ...item, linkedin: value }
                                : item
                          )
                        }));
                      }}
                      className="md:col-span-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase text-muted">
              Notes
            </label>
            <textarea
              name="notes"
              value={formState.notes}
              onChange={handleChange}
              className="mt-2 h-28 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-content"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-base"
            disabled={Object.keys(validation).length > 0}
          >
            Save broker
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrokerForm;
