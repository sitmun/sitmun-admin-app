import { LogLevel } from '@app/services/log-level.enum';
import { LoggerService } from '@app/services/logger.service';

/**
 * Test helper to configure LoggerService for tests.
 * Sets log level to Error so Debug/Info/Warning are not printed and tests stay quiet.
 *
 * @param loggerService - The LoggerService instance from TestBed
 */
export function configureLoggerForTests(loggerService: LoggerService): void {
  loggerService.setLogLevel(LogLevel.Error);
}
