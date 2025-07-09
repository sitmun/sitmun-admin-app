import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

export interface AppState {
  hasInitializationError: boolean;
  initializationError?: any;
  isInitialized: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private stateSubject = new BehaviorSubject<AppState>({
    hasInitializationError: false,
    isInitialized: false
  });

  public state$ = this.stateSubject.asObservable();

  constructor(private loggerService: LoggerService) {
    this.loggerService.info('App state service initialized');
  }

  /**
   * Sets initialization error state
   * @param error - The error object
   * @param source - The source of the error (e.g., 'languages', 'configuration')
   */
  setInitializationError(error: any, source: string): void {
    const currentState = this.stateSubject.value;
    const newState: AppState = {
      ...currentState,
      hasInitializationError: true,
      initializationError: {
        error,
        source,
        timestamp: new Date().toISOString()
      }
    };

    this.stateSubject.next(newState);
    this.loggerService.error(`Initialization error in ${source}`, error);
  }

  /**
   * Marks the app as initialized successfully
   */
  markInitialized(): void {
    const currentState = this.stateSubject.value;
    const newState: AppState = {
      ...currentState,
      isInitialized: true
    };

    this.stateSubject.next(newState);
    this.loggerService.info('App marked as initialized');
  }

  /**
   * Gets the current app state
   */
  getState(): AppState {
    return this.stateSubject.value;
  }

  /**
   * Checks if there's an initialization error
   */
  hasInitializationError(): boolean {
    return this.stateSubject.value.hasInitializationError;
  }

  /**
   * Gets the initialization error
   */
  getInitializationError(): any {
    return this.stateSubject.value.initializationError;
  }

  /**
   * Checks if the app is initialized
   */
  isInitialized(): boolean {
    return this.stateSubject.value.isInitialized;
  }

  /**
   * Clears the initialization error
   */
  clearInitializationError(): void {
    const currentState = this.stateSubject.value;
    const newState: AppState = {
      ...currentState,
      hasInitializationError: false,
      initializationError: undefined
    };

    this.stateSubject.next(newState);
    this.loggerService.info('Initialization error cleared');
  }
} 