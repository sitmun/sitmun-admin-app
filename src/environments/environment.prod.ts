// Production environment configuration (static fallback).
// For Docker builds, use the environment.prod.ts.template with envsubst.

import { LogLevel } from '@app/services/log-level.enum';

export const environment = {
  production: true,
  apiBaseURL: '/backend', // Change this when there is a real production environment
  logLevel: LogLevel.Error,
  version: '1.2.3',
  buildTimestamp: new Date().toISOString(),
  environmentName: 'production'
};
