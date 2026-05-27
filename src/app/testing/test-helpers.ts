import { Provider } from '@angular/core';

import { ErrorHandlerService } from '@app/services/error-handler.service';
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

/**
 * AG Grid logs colDef validation warnings via console.warn when tests mount DataGridComponent.
 * Returns a callback to restore the original implementation.
 */
export function suppressAgGridConsoleWarnings(): () => void {
  const originalWarn = console.warn.bind(console);
  const spy = jest.spyOn(console, 'warn').mockImplementation((message?: unknown, ...args: unknown[]) => {
    if (typeof message === 'string' && message.startsWith('AG Grid')) {
      return;
    }
    originalWarn(message, ...args);
  });
  return () => spy.mockRestore();
}

/**
 * TestBed provider that replaces {@link ErrorHandlerService} with no-op mocks.
 *
 * Form components extending BaseFormComponent run fetchData() from ngOnInit; without a backend,
 * HTTP fails and the real handler opens MatSnackBar, which schedules overlay work after the
 * test fixture is destroyed (NG0406 / NG0205, "Cannot log after tests are done").
 */
export function provideErrorHandlerForTests(): Provider {
  const noop = (): null => null;
  return {
    provide: ErrorHandlerService,
    useFactory: (): ErrorHandlerService =>
      ({
        handleError: noop,
        handleDataNotFound: noop,
        missingRequiredFields: noop
      }) as unknown as ErrorHandlerService
  };
}
