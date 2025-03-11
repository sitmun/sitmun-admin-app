import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@app/services/logger.service';
import { LogLevel } from '@app/services/log-level.enum';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-log-level-control',
  template: `
    <div class="log-level-control" *ngIf="!environment.production">
      <button mat-button [matMenuTriggerFor]="logLevelMenu" class="log-level-button">
        <mat-icon class="log-icon">bug_report</mat-icon>
        <span class="log-level-text">{{ getLogLevelName(currentLogLevel) }}</span>
      </button>
      <mat-menu #logLevelMenu="matMenu">
        <button mat-menu-item *ngFor="let level of logLevels" (click)="onLogLevelChange(level.value)">
          <mat-icon>{{ getIconForLevel(level.value) }}</mat-icon>
          <span>{{ level.name }}</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .log-level-control {
      display: inline-flex;
      align-items: center;
    }
    .log-level-button {
      background-color: #FF9300;
      color: white;
      font-size: 0.8em;
      padding: 0 8px;
      height: 30px;
      line-height: 30px;
    }
    .log-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      margin-right: 4px;
    }
    .log-level-text {
      margin-left: 4px;
    }
  `]
})
export class LogLevelControlComponent implements OnInit {
  currentLogLevel: LogLevel;
  environment = environment;
  logLevels = [
    { name: 'Off', value: LogLevel.Off },
    { name: 'Error', value: LogLevel.Error },
    { name: 'Warning', value: LogLevel.Warning },
    { name: 'Info', value: LogLevel.Info },
    { name: 'Debug', value: LogLevel.Debug },
    { name: 'Trace', value: LogLevel.Trace }
  ];

  constructor(private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.currentLogLevel = this.loggerService.getLogLevel();
  }

  onLogLevelChange(level: LogLevel): void {
    this.loggerService.setLogLevel(level);
    this.currentLogLevel = level;
    this.loggerService.info(`Log level changed to ${LogLevel[level]}`);
  }

  getLogLevelName(level: LogLevel): string {
    return LogLevel[level];
  }

  getIconForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.Off:
        return 'block';
      case LogLevel.Error:
        return 'error';
      case LogLevel.Warning:
        return 'warning';
      case LogLevel.Info:
        return 'info';
      case LogLevel.Debug:
        return 'bug_report';
      case LogLevel.Trace:
        return 'track_changes';
      default:
        return 'settings';
    }
  }
} 