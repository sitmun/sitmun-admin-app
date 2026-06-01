import { Provider } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

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
/**
 * Call inside `beforeAll` to compile the testing module once for the entire suite.
 * Pair with `destroyFixtureAfterEach` and `resetTestingModuleAfterAll` in each spec.
 *
 * Uses `teardown: { destroyAfterEach: false }` so the compiled module is not reset
 * between tests, making `beforeAll` compilation effective.
 */
export async function configureTestingModuleOnce(
  config: TestModuleMetadata
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // destroyAfterEach: 0 as any — truthy non-boolean bypasses both cleanup hooks
  // (beforeEach fires on === false, afterEach fires on === true; 0 matches neither),
  // keeping the compiled module alive for the entire suite.
  await TestBed.configureTestingModule({
    ...config,
    teardown: { destroyAfterEach: 0 as any },
  }).compileComponents();
}

/** Register an `afterEach` hook that destroys the fixture returned by `getFixture`. */
export function destroyFixtureAfterEach(
  getFixture: () => ComponentFixture<unknown> | undefined
): void {
  afterEach(() => getFixture()?.destroy());
}

/** Register an `afterAll` hook that resets the TestBed module. */
export function resetTestingModuleAfterAll(): void {
  afterAll(() => TestBed.resetTestingModule());
}

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
