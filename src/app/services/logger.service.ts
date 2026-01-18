import {Injectable, Injector, Optional} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {environment} from '@environments/environment';

import {ErrorTrackingService} from './error-tracking.service';
import {LogLevel} from './log-level.enum';

/**
 * Logger service for controlling application-wide logging
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private static readonly STORAGE_KEY = 'sitmun_log_level';

  // Current log level - load from localStorage or use environment default
  private level: LogLevel = this.loadPersistedLogLevel();

  // Subject to track log level changes
  private logLevelSubject = new BehaviorSubject<LogLevel>(this.level);

  // Lazy-loaded error tracking service to avoid circular dependencies
  private errorTrackingService?: ErrorTrackingService;
  private static injectorRef: Injector | null = null;

  constructor(@Optional() private injector?: Injector) {
    // Store injector reference statically for lazy access
    if (injector) {
      LoggerService.injectorRef = injector;
    }
  }

  /**
   * Load persisted log level from localStorage
   */
  private loadPersistedLogLevel(): LogLevel {
    try {
      const stored = localStorage.getItem(LoggerService.STORAGE_KEY);
      if (stored !== null) {
        const parsedLevel = parseInt(stored, 10);
        // Validate that it's a valid LogLevel enum value
        if (!isNaN(parsedLevel) && parsedLevel >= LogLevel.Off && parsedLevel <= LogLevel.Trace) {
          return parsedLevel as LogLevel;
        }
      }
    } catch (e) {
      // localStorage not available or error reading - use default
    }
    // Fall back to environment default
    return environment.logLevel || LogLevel.Error;
  }

  /**
   * Persist log level to localStorage
   */
  private persistLogLevel(level: LogLevel): void {
    try {
      localStorage.setItem(LoggerService.STORAGE_KEY, level.toString());
    } catch (e) {
      // localStorage not available or error writing - ignore silently
    }
  }

  /**
   * Observable for log level changes
   */
  get logLevel$(): Observable<LogLevel> {
    return this.logLevelSubject.asObservable();
  }

  /**
   * Set the current log level
   */
  setLogLevel(level: LogLevel) {
    this.level = level;
    this.persistLogLevel(level);
    this.logLevelSubject.next(level);
  }

  /**
   * Get the current log level
   */
  getLogLevel(): LogLevel {
    return this.level;
  }

  /**
   * Determine if a log level is enabled
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  /**
   * Log an error message
   */
  error(message: string, ...data: any[]) {
    this.logWith(LogLevel.Error, message, data);
    
    // Track error in ErrorTrackingService (lazy-loaded to avoid circular dependencies)
    // Skip error tracking during app initialization to prevent circular dependencies
    try {
      // Only try to track if we have an injector and ErrorTrackingService is available
      if (!this.errorTrackingService) {
        // Try to get injector from instance or static reference
        const injectorToUse = this.injector || LoggerService.injectorRef;
        if (!injectorToUse) {
          // During initialization, injector might not be available - skip tracking
          return;
        }
        try {
          this.errorTrackingService = injectorToUse.get(ErrorTrackingService, null);
          if (!this.errorTrackingService) {
            return;
          }
        } catch (e) {
          // Service not available - skip tracking
          return;
        }
      }
      
      if (this.errorTrackingService) {
        const stackTrace = data.length > 0 && data[0]?.stack 
          ? data[0].stack 
          : undefined;
        
        this.errorTrackingService.addError(message, 'logger', {
          details: data.length > 0 ? data : undefined,
          stackTrace
        });
      }
    } catch (e) {
      // ErrorTrackingService not available yet - ignore silently
      // This can happen during app initialization
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...data: any[]) {
    this.logWith(LogLevel.Warning, message, data);
  }

  /**
   * Log an info message
   */
  info(message: string, ...data: any[]) {
    this.logWith(LogLevel.Info, message, data);
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...data: any[]) {
    this.logWith(LogLevel.Debug, message, data);
  }

  /**
   * Log a trace message
   */
  trace(message: string, ...data: any[]) {
    this.logWith(LogLevel.Trace, message, data);
  }

  /**
   * Log with the specified level
   */
  private logWith(level: LogLevel, message: string, data: any[]) {
    if (!this.shouldLog(level)) {
      return;
    }

    // Only get stack trace and timestamp for Trace level
    if (level === LogLevel.Trace) {
      const timestamp = new Date().toISOString();
      const stack = new Error().stack?.split('\n') ?? [];
      const caller = stack[2]?.trim() ?? 'unknown';
      const logPrefix = `[${LogLevel[level]}] [${timestamp}] [${caller}]`;

      if (data.length > 0) {
        console.log(`${logPrefix} ${message}`, ...data);
      } else {
        console.log(`${logPrefix} ${message}`);
      }
      return;
    }

    // For all other levels, use simple logging without timestamp or stack trace
    const logPrefix = `[${LogLevel[level]}]`;
    switch (level) {
      case LogLevel.Error:
        if (data.length > 0) {
          console.error(`${logPrefix} ${message}`, ...data);
        } else {
          console.error(`${logPrefix} ${message}`);
        }
        break;
      case LogLevel.Warning:
        if (data.length > 0) {
          console.warn(`${logPrefix} ${message}`, ...data);
        } else {
          console.warn(`${logPrefix} ${message}`);
        }
        break;
      case LogLevel.Info:
        if (data.length > 0) {
          console.info(`${logPrefix} ${message}`, ...data);
        } else {
          console.info(`${logPrefix} ${message}`);
        }
        break;
      case LogLevel.Debug:
        if (data.length > 0) {
          console.log(`${logPrefix} ${message}`, ...data);
        } else {
          console.log(`${logPrefix} ${message}`);
        }
        break;
    }
  }
}
