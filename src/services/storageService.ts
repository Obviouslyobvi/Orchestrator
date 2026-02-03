import { DataBroker } from '../types';

const STORAGE_KEY = 'ca-data-brokers';

export const loadBrokers = (): DataBroker[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as DataBroker[];
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
    'CEO/Key Contact',
    'Title',
    'Industry',
    'Company Address',
    'Phone Number',
    'Email Address',
    'LinkedIn Profile URL',
    'Company LinkedIn Page',
    'Company Website',
    'Additional Decision Makers',
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
    csvEscape(broker.ceoName),
    csvEscape(broker.title),
    csvEscape(broker.industry),
    csvEscape(broker.address),
    csvEscape(broker.phone),
    csvEscape(broker.email),
    csvEscape(broker.linkedin),
    csvEscape(broker.companyLinkedin),
    csvEscape(broker.website),
    csvEscape(broker.additionalContacts),
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
