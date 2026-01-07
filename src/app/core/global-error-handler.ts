import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorTrackingService } from '@app/services/error-tracking.service';
import { LoggerService } from '@app/services/logger.service';

/**
 * Global error handler that catches all uncaught exceptions and unhandled promise rejections
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorTrackingService?: ErrorTrackingService;
  private loggerService?: LoggerService;

  constructor(private injector: Injector) {
    // Lazy load to avoid circular dependencies
    try {
      this.errorTrackingService = this.injector.get(ErrorTrackingService, null);
      this.loggerService = this.injector.get(LoggerService, null);
    } catch (e) {
      // Services not available yet
    }
  }

  handleError(error: any): void {
    // Ensure services are loaded
    if (!this.errorTrackingService) {
      try {
        this.errorTrackingService = this.injector.get(ErrorTrackingService);
      } catch (e) {
        // Service not available
      }
    }
    if (!this.loggerService) {
      try {
        this.loggerService = this.injector.get(LoggerService);
      } catch (e) {
        // Service not available
      }
    }

    // Extract error message
    const message = error?.message || error?.toString() || 'Unknown error';
    const stackTrace = error?.stack || undefined;

    // Log to console for development
    console.error('GlobalErrorHandler caught:', error);

    // Log via LoggerService if available
    if (this.loggerService) {
      this.loggerService.error(`Uncaught exception: ${message}`, error);
    }

    // Track in ErrorTrackingService if available
    if (this.errorTrackingService) {
      this.errorTrackingService.addError(
        message,
        'uncaught',
        {
          details: error,
          stackTrace
        }
      );
    }
  }
}



