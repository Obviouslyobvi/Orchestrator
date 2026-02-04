export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace accounts.oauth2 {
      interface TokenResponse {
        access_token: string;
        expires_in: number;
        error?: string;
        error_description?: string;
      }

      interface TokenClient {
        callback: (response: TokenResponse) => void;
        requestAccessToken: (options: { prompt: '' | 'consent' }) => void;
      }

      function initTokenClient(options: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }): TokenClient;
    }
  }
}
