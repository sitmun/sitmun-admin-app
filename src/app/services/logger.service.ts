import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { LogLevel } from './log-level.enum';

/**
 * Logger service for controlling application-wide logging
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  // Current log level - set from environment by default
  private level: LogLevel = environment.logLevel || LogLevel.Error;

  /**
   * Set the current log level
   */
  setLogLevel(level: LogLevel) {
    this.level = level;
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

    const timestamp = new Date().toISOString();
    const logPrefix = `[${timestamp}] [${LogLevel[level]}]`;

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
      case LogLevel.Trace:
        if (data.length > 0) {
          console.log(`${logPrefix} ${message}`, ...data);
        } else {
          console.log(`${logPrefix} ${message}`);
        }
        break;
    }
  }
}
