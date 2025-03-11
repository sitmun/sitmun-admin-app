import { LogLevel } from '@app/services/log-level.enum';

export const environment = {
  production: true,
  apiBaseURL: 'http://localhost:8080',  // Change this when there is a real production environment
  logLevel: LogLevel.Error, // Only show errors in production
};
