// Development environment configuration.
// Uses the local docker-compose stack backend URL.

import { LogLevel } from '@app/services/log-level.enum';

export const environment = {
  production: false,
  apiBaseURL: '/backend',
  logLevel: LogLevel.Debug,
  version: '1.2.0',
  buildTimestamp: new Date().toISOString(),
  environmentName: 'development'
};
