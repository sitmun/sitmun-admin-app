import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VERSION } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '@app/core/auth/login.service';
import { Principal } from '@app/core/auth/principal.service';
import { LoggerService } from '@app/services/logger.service';
import { LogLevel } from '@app/services/log-level.enum';
import { ErrorTrackingService } from '@app/services/error-tracking.service';
import { SidebarManagerService } from '@app/services/sidebar-manager.service';
import { AboutDialogComponent, AboutDialogData } from '@app/components/shared/about-dialog/about-dialog.component';
import { User } from '@app/domain';
import { environment } from '@environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-system-info-menu',
  templateUrl: './system-info-menu.component.html',
  styleUrls: ['./system-info-menu.component.scss']
})
export class SystemInfoMenuComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentLogLevel: LogLevel;
  environment = environment;
  angularVersion = VERSION.full;
  
  unreviewedErrorCount = 0;
  
  private authSubscription?: Subscription;
  private errorsSubscription?: Subscription;
  private logLevelSubscription?: Subscription;

  constructor(
    private principal: Principal,
    private loginService: LoginService,
    private router: Router,
    private loggerService: LoggerService,
    private errorTrackingService: ErrorTrackingService,
    private sidebarManager: SidebarManagerService,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.currentLogLevel = this.loggerService.getLogLevel();
  }

  ngOnInit(): void {
    // Do nothing in ngOnInit to avoid blocking
    // All initialization happens lazily when the menu is opened
  }

  /**
   * Called when the menu is opened to load data
   */
  onMenuOpened(): void {
    // Only set up subscriptions on first open
    if (!this.authSubscription) {
      this.loadCurrentUser();
      this.updateErrorCount();

      // Subscribe to authentication state changes
      this.authSubscription = this.principal.getAuthenticationState().subscribe(() => {
        this.loadCurrentUser();
      });

      // Subscribe to error changes
      this.errorsSubscription = this.errorTrackingService.errors$.subscribe(() => {
        this.updateErrorCount();
      });

      // Subscribe to log level changes
      this.logLevelSubscription = this.loggerService.logLevel$.subscribe(level => {
        this.currentLogLevel = level;
      });
    } else {
      // On subsequent opens, just refresh the data
      this.updateErrorCount();
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.errorsSubscription?.unsubscribe();
    this.logLevelSubscription?.unsubscribe();
  }

  loadCurrentUser(): void {
    this.principal.identity().then((user) => {
      this.currentUser = user;
    });
  }

  updateErrorCount(): void {
    this.unreviewedErrorCount = this.errorTrackingService.getUnreviewedCount();
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

  openErrorSidebar(): void {
    this.sidebarManager.openSidebar('error');
  }

  openAboutDialog(): void {
    // Get translated application name
    const applicationName = this.translateService.instant('systemInfo.applicationName');
    
    const dialogData: AboutDialogData = {
      applicationName: applicationName,
      version: this.environment.version || 'N/A',
      environmentName: this.environment.environmentName || 'N/A',
      angularVersion: this.angularVersion,
      buildTimestamp: this.environment.buildTimestamp
    };

    this.dialog.open(AboutDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: dialogData
    });
  }

  triggerTestError(): void {
    // Create a test error for debugging - add directly to ErrorTrackingService
    const testError = {
      test: true,
      timestamp: new Date().toISOString(),
      source: 'System Info Menu'
    };
    
    console.log('[SystemInfoMenu] Triggering test error...');
    
    // Add error directly to tracking service
    this.errorTrackingService.addError(
      'Test error triggered from system menu',
      'logger',
      {
        details: testError,
        stackTrace: new Error().stack
      }
    );
    
    console.log('[SystemInfoMenu] Error added. Total errors:', this.errorTrackingService.getErrors().length);
    
    // Also log it via logger service
    this.loggerService.error('Test error triggered from system menu', testError);
    
    // Open the error sidebar to show the error
    this.openErrorSidebar();
  }

  shouldShowDebugFeatures(): boolean {
    return this.currentLogLevel >= LogLevel.Debug;
  }

  logout(): void {
    this.loginService.logout();
    void this.router.navigate(['/login']);
  }

  getUserFullName(): string {
    if (this.currentUser) {
      if (this.currentUser.firstName && this.currentUser.lastName) {
        return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      } else if (this.currentUser.firstName) {
        return this.currentUser.firstName;
      } else if (this.currentUser.lastName) {
        return this.currentUser.lastName;
      } else {
        return this.currentUser.username;
      }
    }
    return '';
  }

  logLevels = [
    { name: 'Off', value: LogLevel.Off },
    { name: 'Error', value: LogLevel.Error },
    { name: 'Warning', value: LogLevel.Warning },
    { name: 'Info', value: LogLevel.Info },
    { name: 'Debug', value: LogLevel.Debug },
    { name: 'Trace', value: LogLevel.Trace }
  ];
}

