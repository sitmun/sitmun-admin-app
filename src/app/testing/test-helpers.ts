import { LogLevel } from '@app/services/log-level.enum';
import { LoggerService } from '@app/services/logger.service';

/**
 * Test helper to configure LoggerService for tests
 * Sets log level to Warning to suppress Debug/Info messages during tests
 * This prevents console.log noise from debug messages like "fetchData skipped: no auth token"
 * 
 * @param loggerService - The LoggerService instance from TestBed
 */
export function configureLoggerForTests(loggerService: LoggerService): void {
  loggerService.setLogLevel(LogLevel.Warning);
}
