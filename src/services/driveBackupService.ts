const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'CA Data Brokers Backups';

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;
let tokenExpiry = 0;

const loadGoogleScript = () =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[data-google-identity]')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity script.'));
    document.head.appendChild(script);
  });

const initTokenClient = async () => {
  if (tokenClient) {
    return tokenClient;
  }
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  if (!clientId) {
    throw new Error('Missing VITE_GOOGLE_CLIENT_ID environment variable.');
  }
  await loadGoogleScript();
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: DRIVE_SCOPE,
    callback: () => {}
  });
  return tokenClient;
};

const requestAccessToken = async () => {
  const client = await initTokenClient();
  return new Promise<TokenResponse>((resolve, reject) => {
    client.callback = (response) => {
      if ('error' in response) {
        reject(new Error(response.error_description || 'Google auth failed.'));
        return;
      }
      resolve(response);
    };
    client.requestAccessToken({ prompt: '' });
  }).catch(async () => {
    return new Promise<TokenResponse>((resolve, reject) => {
      client.callback = (response) => {
        if ('error' in response) {
          reject(new Error(response.error_description || 'Google auth failed.'));
          return;
        }
        resolve(response);
      };
      client.requestAccessToken({ prompt: 'consent' });
    });
  });
};

const getAccessToken = async () => {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }
  const tokenResponse = await requestAccessToken();
  accessToken = tokenResponse.access_token;
  tokenExpiry = now + tokenResponse.expires_in * 1000 - 30_000;
  return accessToken;
};

const getFolderId = async (token: string) => {
  const query = encodeURIComponent(
    `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  if (!response.ok) {
    throw new Error('Failed to search Drive folder.');
  }
  const data = (await response.json()) as { files: { id: string }[] };
  if (data.files.length > 0) {
    return data.files[0].id;
  }
  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });
  if (!createResponse.ok) {
    throw new Error('Failed to create Drive backup folder.');
  }
  const created = (await createResponse.json()) as { id: string };
  return created.id;
};

const formatTimestamp = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
};

export const backupCsvToDrive = async (csv: string) => {
  const token = await getAccessToken();
  const folderId = await getFolderId(token);
  const timestamp = formatTimestamp(new Date());
  const filename = `ca-data-brokers-backup-${timestamp}.csv`;
  const boundary = `boundary-${crypto.randomUUID()}`;
  const metadata = {
    name: filename,
    parents: [folderId]
  };
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: text/csv',
    '',
    csv,
    `--${boundary}--`
  ].join('\r\n');
  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body
    }
  );
  if (!response.ok) {
    throw new Error('Failed to upload backup to Drive.');
  }
};
