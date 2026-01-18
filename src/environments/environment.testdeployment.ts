import { LogLevel } from '@app/services/log-level.enum';

export const environment = {
  production: false,
  apiBaseURL: 'https://sitmun-backend-core.herokuapp.com',
  logLevel: LogLevel.Info, // Set to Info for test deployment
  version: '1.2.0-rc.1',
  buildTimestamp: new Date().toISOString(),
  environmentName: 'testdeployment'
};
