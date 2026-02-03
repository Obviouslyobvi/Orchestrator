export enum ConnectionStatus {
  NOT_CONTACTED = 'Not Contacted',
  IN_PROGRESS = 'In Progress',
  PARTNERED = 'Partnered',
  CLOSED = 'Closed'
}

export interface DataBroker {
  id: string;
  companyName: string;
  ceoName: string;
  title?: string;
  industry?: string;
  address?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  companyLinkedin?: string;
  website?: string;
  additionalContacts?: string;
  companySize?: string;
  dataProducts?: string;
  status: ConnectionStatus;
  notes?: string;
  lastContact?: string;
  nextFollowup?: string;
  dateAdded: string;
  lastModified: string;
}

export type DataBrokerInput = Omit<
  DataBroker,
  'id' | 'dateAdded' | 'lastModified'
>;

export interface StatusOption {
  value: ConnectionStatus;
  label: string;
}
