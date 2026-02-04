import { DataBroker } from '../types';

const STORAGE_KEY = 'ca-data-brokers';

const normalizeBroker = (broker: Partial<DataBroker>): DataBroker => {
  const additionalContacts = Array.isArray(broker.additionalContacts)
    ? broker.additionalContacts
    : [];
  return {
    id: broker.id ?? crypto.randomUUID(),
    companyName: broker.companyName ?? '',
    primaryContact: broker.primaryContact ?? (broker as any).ceoName ?? '',
    contactRole: broker.contactRole ?? (broker as any).title ?? '',
    industry: broker.industry,
    address: broker.address,
    phone: broker.phone,
    email: broker.email,
    linkedin: broker.linkedin,
    companyLinkedin: broker.companyLinkedin,
    website: broker.website,
    additionalContacts,
    companySize: broker.companySize,
    dataProducts: broker.dataProducts,
    status: broker.status ?? 'Not Contacted',
    notes: broker.notes,
    lastContact: broker.lastContact,
    nextFollowup: broker.nextFollowup,
    dateAdded: broker.dateAdded ?? new Date().toISOString(),
    lastModified: broker.lastModified ?? new Date().toISOString()
  } as DataBroker;
};

export const loadBrokers = (): DataBroker[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as DataBroker[];
    return parsed.map((broker) => normalizeBroker(broker));
  } catch (error) {
    console.error('Failed to parse brokers from storage', error);
    return [];
  }
};

export const saveBrokers = (brokers: DataBroker[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brokers));
};

const csvEscape = (value?: string) => {
  if (!value) {
    return '';
  }
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const exportBrokersToCsv = (brokers: DataBroker[]) => {
  const headers = [
    'Company Name',
    'Primary Contact',
    'Contact Role',
    'Industry',
    'Company Address',
    'Phone Number',
    'Email Address',
    'LinkedIn Profile URL',
    'Company LinkedIn Page',
    'Company Website',
    'Additional Contacts',
    'Company Size/Revenue',
    'Data Products They Buy',
    'Connection Status',
    'Notes',
    'Last Contact Date',
    'Next Follow-up Date',
    'Date Added',
    'Last Modified'
  ];
  const rows = brokers.map((broker) => [
    csvEscape(broker.companyName),
    csvEscape(broker.primaryContact),
    csvEscape(broker.contactRole),
    csvEscape(broker.industry),
    csvEscape(broker.address),
    csvEscape(broker.phone),
    csvEscape(broker.email),
    csvEscape(broker.linkedin),
    csvEscape(broker.companyLinkedin),
    csvEscape(broker.website),
    csvEscape(
      broker.additionalContacts
        .map((contact) =>
          [
            contact.name,
            contact.role,
            contact.email,
            contact.phone,
            contact.linkedin
          ]
            .filter(Boolean)
            .join(' | ')
        )
        .join('; ')
    ),
    csvEscape(broker.companySize),
    csvEscape(broker.dataProducts),
    csvEscape(broker.status),
    csvEscape(broker.notes),
    csvEscape(broker.lastContact),
    csvEscape(broker.nextFollowup),
    csvEscape(broker.dateAdded),
    csvEscape(broker.lastModified)
  ]);
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};
