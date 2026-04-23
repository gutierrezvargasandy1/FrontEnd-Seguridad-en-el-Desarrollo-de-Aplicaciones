export interface Environment {
  production: boolean;
  apiUrl: string;
  apiVersion: string;
  timeout: number;
  retryAttempts: number;
  features: {
    enableCache: boolean;
    enableLogging: boolean;
    enableMockData: boolean;
  };
  endpoints: {
    auth: string;
    users: string;
    tasks: string;
  };
}