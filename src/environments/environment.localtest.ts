//
// The local test environment configuration file.
//
// Used for local testing with optimized settings for testing purposes.
//

import {LogLevel} from '@app/services/log-level.enum';

export const environment = {
  production: false,
  // This is the external URL of the backend server for local testing
  apiBaseURL: 'http://localhost:8080',
  logLevel: LogLevel.Info, // Set to Info for local testing (less verbose than debug)
};
