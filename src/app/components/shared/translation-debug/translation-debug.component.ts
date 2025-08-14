import {Component, OnDestroy, OnInit} from '@angular/core';
import { TranslationMonitorService } from '@app/services/translation-monitor.service';
import { LoggerService } from '@app/services/logger.service';
import { LogLevel } from '@app/services/log-level.enum';
import { Subscription } from 'rxjs';

/**
 * Debug component to display missing translation keys
 * Only shown when log level is Debug or Trace
 */
@Component({
  selector: 'app-translation-debug',
  template: `
    <div *ngIf="showDebug" class="translation-debug">
      <h3>Missing Translation Keys ({{ missingKeys.length }})</h3>
      <button (click)="clearMissingKeys()">Clear List</button>
      <button (click)="exportMissingKeys()">Export to Console</button>
      <ul>
        <li *ngFor="let key of missingKeys">{{ key }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .translation-debug {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f5f5f5;
      border: 1px solid #ccc;
      padding: 10px;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      font-size: 12px;
    }
    .translation-debug h3 {
      margin: 0 0 10px 0;
      color: #d32f2f;
    }
    .translation-debug button {
      margin: 0 5px 5px 0;
      padding: 5px 10px;
      font-size: 11px;
    }
    .translation-debug ul {
      margin: 0;
      padding-left: 20px;
    }
    .translation-debug li {
      margin: 2px 0;
      word-break: break-all;
    }
  `]
})
export class TranslationDebugComponent implements OnInit, OnDestroy {
  missingKeys: string[] = [];
  showDebug = false;
  private logLevelSubscription?: Subscription;
  private updateInterval?: any;

  constructor(
    private translationMonitor: TranslationMonitorService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    // Subscribe to log level changes
    this.logLevelSubscription = this.loggerService.logLevel$.subscribe(
      (logLevel) => {
        this.showDebug = logLevel >= LogLevel.Debug;

        if (this.showDebug) {
          this.updateMissingKeys();
          this.startPeriodicUpdates();
        } else {
          this.stopPeriodicUpdates();
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions and intervals
    if (this.logLevelSubscription) {
      this.logLevelSubscription.unsubscribe();
    }
    this.stopPeriodicUpdates();
  }

  private startPeriodicUpdates(): void {
    if (!this.updateInterval) {
      // Update every 5 seconds
      this.updateInterval = setInterval(() => {
        this.updateMissingKeys();
      }, 5000);
    }
  }

  private stopPeriodicUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }
  }

  updateMissingKeys(): void {
    this.missingKeys = this.translationMonitor.getMissingKeys();
  }

  clearMissingKeys(): void {
    this.translationMonitor.clearMissingKeys();
    this.updateMissingKeys();
  }

  exportMissingKeys(): void {
    const summary = this.translationMonitor.getMissingKeysSummary();
    this.loggerService.info('Missing translation keys exported', summary);
    console.table(summary.keys);
  }
}
