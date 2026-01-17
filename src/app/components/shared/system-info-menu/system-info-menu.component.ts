import { Component, OnInit, OnDestroy, ChangeDetectorRef,  VERSION } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AboutDialogComponent, AboutDialogData } from '@app/components/shared/about-dialog/about-dialog.component';
import { ConfigurationParametersDialogComponent } from '@app/components/shared/configuration-parameters-dialog/configuration-parameters-dialog.component';
import { AuthService } from '@app/core/auth/auth.service';
import { LoginService } from '@app/core/auth/login.service';
import { Principal } from '@app/core/auth/principal.service';
import { FeatureFlagKeys, FeatureFlagConfig } from '@app/core/features/feature-flag.config';
import { FeatureFlagService } from '@app/core/features/feature-flag.service';
import { User } from '@app/domain';
import { ErrorTrackingService } from '@app/services/error-tracking.service';
import { LogLevel } from '@app/services/log-level.enum';
import { LoggerService } from '@app/services/logger.service';
import { SidebarManagerService } from '@app/services/sidebar-manager.service';
import { environment } from '@environments/environment';


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
  currentCategory = '';
  
  private authSubscription?: Subscription;
  private errorsSubscription?: Subscription;
  private logLevelSubscription?: Subscription;
  private featureFlagsSubscription?: Subscription;

  constructor(
    private principal: Principal,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private loggerService: LoggerService,
    private errorTrackingService: ErrorTrackingService,
    private sidebarManager: SidebarManagerService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private featureFlagService: FeatureFlagService,
    private snackBar: MatSnackBar
  ) {
    this.currentLogLevel = this.loggerService.getLogLevel();
    // Initialize current category with first available category
    if (!this.environment.production) {
      const categories = this.featureFlagService.getCategories();
      if (categories.length > 0) {
        this.currentCategory = categories[0];
      }
      // Subscribe to feature flag changes for auto-update
      this.featureFlagsSubscription = this.featureFlagService.featureFlags$.subscribe(() => {
        this.cdr.markForCheck();
      });
    }
  }

  ngOnInit(): void {
    // Load user if already authenticated (don't wait for menu to open)
    if (this.authService.getToken()) {
      this.loadCurrentUser();
      // Set up subscription to authentication state changes
      this.authSubscription = this.principal.getAuthenticationState().subscribe(() => {
        this.loadCurrentUser();
      });
    }
  }


  /**
   * Called when the menu is opened to load data
   */
  onMenuOpened(): void {
    // Only set up subscriptions on first open
    if (!this.errorsSubscription) {
      this.updateErrorCount();

      // Subscribe to error changes
      this.errorsSubscription = this.errorTrackingService.errors$.subscribe(() => {
        this.updateErrorCount();
      });

      // Subscribe to log level changes
      this.logLevelSubscription = this.loggerService.logLevel$.subscribe(level => {
        this.currentLogLevel = level;
      });
    } else {
      // On subsequent opens, just update error count
      this.updateErrorCount();
    }
    
    // Ensure user is loaded if authenticated (in case it wasn't loaded in ngOnInit)
    if (this.authService.getToken() && !this.currentUser) {
      this.loadCurrentUser();
    }
    
    // Ensure current category is set when menu opens
    if (!this.environment.production && !this.currentCategory) {
      const categories = this.featureFlagService.getCategories();
      if (categories.length > 0) {
        this.currentCategory = categories[0];
      }
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.errorsSubscription?.unsubscribe();
    this.logLevelSubscription?.unsubscribe();
    this.featureFlagsSubscription?.unsubscribe();
  }

  loadCurrentUser(): void {
    // Only load if we have a token (user is authenticated)
    if (this.authService.getToken()) {
      this.principal.identity().then((user) => {
        // Set user if it exists (getUserFullName will handle empty properties)
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = null;
          this.loggerService.warn('User identity returned null');
        }
        // Mark for check to update the view
        this.cdr.markForCheck();
      }).catch((error) => {
        // If identity fails, set to null
        this.currentUser = null;
        this.loggerService.error('Failed to load user identity:', error);
        this.cdr.markForCheck();
      });
    } else {
      // No token, user is not authenticated
      this.currentUser = null;
      this.cdr.markForCheck();
    }
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

  openConfigurationParametersDialog(): void {
    this.dialog.open(ConfigurationParametersDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }

  triggerTestError(): void {
    // Create a test error for debugging - add directly to ErrorTrackingService
    const testError = {
      test: true,
      timestamp: new Date().toISOString(),
      source: 'System Info Menu'
    };
    
    // Add error directly to tracking service
    this.errorTrackingService.addError(
      'Test error triggered from system menu',
      'logger',
      {
        details: testError,
        stackTrace: new Error().stack
      }
    );
    
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
      const firstName = this.currentUser.firstName?.trim() || '';
      const lastName = this.currentUser.lastName?.trim() || '';
      const username = this.currentUser.username?.trim() || '';
      
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      } else if (username) {
        return username;
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

  /**
   * Get categories from service
   */
  getCategories(): string[] {
    return this.featureFlagService.getCategories();
  }

  /**
   * Get features for a category from service
   */
  getFeaturesByCategory(category: string): Array<{ key: FeatureFlagKeys; config: FeatureFlagConfig }> {
    return this.featureFlagService.getFeaturesByCategory(category);
  }

  /**
   * Track by function for feature flags
   */
  trackByFeatureKey(index: number, flag: { key: FeatureFlagKeys; config: FeatureFlagConfig }): FeatureFlagKeys {
    return flag.key;
  }

  /**
   * Get translated category name
   */
  getCategoryName(category: string): string {
    const categoryKey = `featureFlags.category.${category.toLowerCase()}`;
    const translated = this.translateService.instant(categoryKey);
    // If translation doesn't exist, return the original category name
    return translated !== categoryKey ? translated : category;
  }

  /**
   * Set current category for submenu
   */
  setCurrentCategory(category: string): void {
    this.currentCategory = category;
    this.cdr.markForCheck();
  }


  /**
   * Toggle a feature flag
   */
  toggleFeatureFlag(flag: FeatureFlagKeys, event: Event): void {
    // Stop propagation to prevent menu from closing immediately
    // This allows the user to see the state change
    if (event) {
      event.stopPropagation();
    }
    
    if (!this.environment.production) {
      try {
        // Call the service's toggleFeature method
        this.featureFlagService.toggleFeature(flag);
        
        // Get updated config to show current state
        const config = this.featureFlagService.getFeatureConfig(flag);
        const state = config?.enabled ? 'enabled' : 'disabled';
        const message = this.translateService.instant(
          'systemInfo.featureFlags.toggled',
          { state }
        );
        this.snackBar.open(message, '', { duration: 2000 });
        
        // Force change detection to update the UI immediately
        // The observable subscription will also trigger, but this ensures immediate update
        this.cdr.detectChanges();
      } catch (error) {
        this.loggerService.error('Failed to toggle feature flag:', error);
      }
    }
  }

  /**
   * Reset all feature flags to defaults
   */
  resetFeatureFlags(): void {
    if (!this.environment.production) {
      this.featureFlagService.resetFeatures();
      // Reset to first category
      const categories = this.featureFlagService.getCategories();
      if (categories.length > 0) {
        this.currentCategory = categories[0];
      }
      const message = this.translateService.instant('systemInfo.featureFlags.resetSuccess');
      this.snackBar.open(message, '', { duration: 2000 });
    }
  }

  /**
   * Check if a feature flag is enabled
   */
  isFeatureEnabled(flag: FeatureFlagKeys): boolean {
    return this.featureFlagService.isFeatureEnabled(flag);
  }
}

