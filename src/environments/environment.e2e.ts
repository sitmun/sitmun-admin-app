// E2E environment: same-origin /backend proxied to local backend.
import { LogLevel } from '@app/services/log-level.enum';

export const environment = {
  production: false,
  apiBaseURL: '/backend',
  logLevel: LogLevel.Error,
  version: '1.2.8-SNAPSHOT',
  buildTimestamp: new Date().toISOString(),
  environmentName: 'e2e'
};
