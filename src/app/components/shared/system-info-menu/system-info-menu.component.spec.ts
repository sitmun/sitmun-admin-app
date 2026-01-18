import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '@app/core/auth/auth.service';
import { LoginService } from '@app/core/auth/login.service';
import { Principal } from '@app/core/auth/principal.service';
import { FeatureFlagService } from '@app/core/features/feature-flag.service';
import { User } from '@app/domain';
import { ErrorTrackingService } from '@app/services/error-tracking.service';
import { LogLevel } from '@app/services/log-level.enum';
import { LoggerService } from '@app/services/logger.service';
import { SidebarManagerService } from '@app/services/sidebar-manager.service';

import { SystemInfoMenuComponent } from './system-info-menu.component';

describe('SystemInfoMenuComponent', () => {
  let component: SystemInfoMenuComponent;
  let fixture: ComponentFixture<SystemInfoMenuComponent>;
  let principal: jest.Mocked<Principal>;
  let authService: jest.Mocked<AuthService>;
  let loggerService: jest.Mocked<LoggerService>;
  let errorTrackingService: jest.Mocked<ErrorTrackingService>;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let logLevelSubject: BehaviorSubject<LogLevel>;
  let errorsSubject: BehaviorSubject<any[]>;
  let authStateSubject: BehaviorSubject<any>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User'
  } as User;

  beforeEach(async () => {
    logLevelSubject = new BehaviorSubject<LogLevel>(LogLevel.Info);
    errorsSubject = new BehaviorSubject<any[]>([]);
    authStateSubject = new BehaviorSubject<any>(null);

    principal = {
      getAuthenticationState: jest.fn(() => authStateSubject.asObservable()),
      identity: jest.fn(() => Promise.resolve(mockUser))
    } as any;

    authService = {
      getToken: jest.fn(() => 'mock-token')
    } as any;

    loggerService = {
      logLevel$: logLevelSubject.asObservable(),
      getLogLevel: jest.fn(() => LogLevel.Info),
      setLogLevel: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn()
    } as any;

    errorTrackingService = {
      errors$: errorsSubject.asObservable(),
      getUnreviewedCount: jest.fn(() => 0),
      addError: jest.fn()
    } as any;

    featureFlagService = {
      featureFlags$: new BehaviorSubject<any>({}),
      getCategories: jest.fn(() => ['category1']),
      getFeaturesByCategory: jest.fn(() => []),
      toggleFeature: jest.fn(),
      getFeatureConfig: jest.fn(() => ({ enabled: false })),
      isFeatureEnabled: jest.fn(() => false),
      resetFeatures: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [SystemInfoMenuComponent],
      imports: [
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Principal, useValue: principal },
        { provide: AuthService, useValue: authService },
        { provide: LoginService, useValue: { logout: jest.fn() } },
        { provide: LoggerService, useValue: loggerService },
        { provide: ErrorTrackingService, useValue: errorTrackingService },
        { provide: FeatureFlagService, useValue: featureFlagService },
        { provide: SidebarManagerService, useValue: { openSidebar: jest.fn() } },
        { provide: MatDialog, useValue: { open: jest.fn() } },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemInfoMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('subscription behavior', () => {
    it('should subscribe to authentication state on init if token exists', () => {
      fixture.detectChanges();
      
      expect(principal.getAuthenticationState).toHaveBeenCalled();
      expect(principal.identity).toHaveBeenCalled();
    });

    it('should update log level when logLevel$ emits', () => {
      fixture.detectChanges();
      expect(component.currentLogLevel()).toBe(LogLevel.Info);
      
      logLevelSubject.next(LogLevel.Debug);
      fixture.detectChanges();
      
      expect(component.currentLogLevel()).toBe(LogLevel.Debug);
    });

    it('should update error count when errors$ emits', () => {
      fixture.detectChanges();
      expect(component.unreviewedErrorCount()).toBe(0);
      
      (errorTrackingService.getUnreviewedCount as jest.Mock).mockReturnValue(3);
      errorsSubject.next([{}, {}, {}]);
      fixture.detectChanges();
      
      expect(component.unreviewedErrorCount()).toBe(3);
    });

    it('should subscribe to feature flags in constructor if not production', () => {
      fixture.detectChanges();
      
      // Feature flags subscription should be set up
      expect(featureFlagService.getCategories).toHaveBeenCalled();
    });

    it('should not error on destroy', () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('menu operations', () => {
    it('should load current user on menu opened if authenticated', async () => {
      fixture.detectChanges();
      
      component.onMenuOpened();
      await fixture.whenStable();
      
      expect(component.currentUser()).toEqual(mockUser);
    });

    it('should update error count after errors emit', () => {
      (errorTrackingService.getUnreviewedCount as jest.Mock).mockReturnValue(5);
      errorsSubject.next([{}, {}, {}, {}, {}]);
      fixture.detectChanges();

      expect(component.unreviewedErrorCount()).toBe(5);
    });
  });

  describe('log level operations', () => {
    it('should change log level', () => {
      component.onLogLevelChange(LogLevel.Debug);
      
      expect(loggerService.setLogLevel).toHaveBeenCalledWith(LogLevel.Debug);
      logLevelSubject.next(LogLevel.Debug);
      fixture.detectChanges();
      expect(component.currentLogLevel()).toBe(LogLevel.Debug);
    });
  });

  describe('user operations', () => {
    it('should get user full name correctly', () => {
      component.currentUser.set(mockUser);
      expect(component.getUserFullName()).toBe('Test User');
      
      component.currentUser.set({ ...mockUser, firstName: '', lastName: '' } as User);
      expect(component.getUserFullName()).toBe('testuser');
    });
  });
});
