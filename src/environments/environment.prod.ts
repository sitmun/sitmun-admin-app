import { LogLevel } from '@app/services/log-level.enum';

export const environment = {
  production: true,
  apiBaseURL: 'http://localhost:8080',  // Change this when there is a real production environment
  logLevel: LogLevel.Error, // Only show errors in production
  version: '1.2.0-rc.1',
  buildTimestamp: new Date().toISOString(),
  environmentName: 'production'
};
