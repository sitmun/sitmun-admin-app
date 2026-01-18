import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { ErrorTrackingService, ErrorEntry } from '@app/services/error-tracking.service';
import { SidebarManagerService } from '@app/services/sidebar-manager.service';

import { ErrorDetailsSidebarComponent } from './error-details-sidebar.component';

describe('ErrorDetailsSidebarComponent', () => {
  let component: ErrorDetailsSidebarComponent;
  let fixture: ComponentFixture<ErrorDetailsSidebarComponent>;
  let errorTrackingService: jest.Mocked<ErrorTrackingService>;
  let sidebarManagerService: jest.Mocked<SidebarManagerService>;
  let errorsSubject: BehaviorSubject<ErrorEntry[]>;

  const mockErrors: ErrorEntry[] = [
    {
      id: '1',
      timestamp: new Date('2024-01-01'),
      message: 'Test error 1',
      type: 'http',
      httpStatus: 404,
      reviewed: false
    },
    {
      id: '2',
      timestamp: new Date('2024-01-02'),
      message: 'Test error 2',
      type: 'logger',
      reviewed: false
    }
  ];

  beforeEach(async () => {
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn() },
        writable: true
      });
    }

    errorsSubject = new BehaviorSubject<ErrorEntry[]>([]);

    errorTrackingService = {
      errors$: errorsSubject.asObservable(),
      getErrors: jest.fn(() => mockErrors),
      clearErrors: jest.fn(),
      addError: jest.fn(),
      getUnreviewedCount: jest.fn(() => 2),
      markAsReviewed: jest.fn(),
      markErrorAsReviewed: jest.fn()
    } as any;

    sidebarManagerService = {
      activeSidebar$: new BehaviorSubject<string | null>(null),
      openSidebar: jest.fn(),
      closeSidebar: jest.fn(),
      getActiveSidebar: jest.fn(() => null)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ErrorDetailsSidebarComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ErrorTrackingService, useValue: errorTrackingService },
        { provide: SidebarManagerService, useValue: sidebarManagerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDetailsSidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('subscription behavior', () => {
    it('should expose errors$ observable', () => {
      expect(component.errors$).toBeDefined();
    });

    it('should update errors when errors$ emits new values', (done) => {
      fixture.detectChanges();
      
      const newErrors: ErrorEntry[] = [
        {
          id: '3',
          timestamp: new Date('2024-01-03'),
          message: 'New error',
          type: 'uncaught',
          reviewed: false
        }
      ];
      
      errorsSubject.next(newErrors);
      fixture.detectChanges();
      
      component.errors$.subscribe(errors => {
        expect(errors).toEqual(newErrors);
        done();
      });
    });

    it('should not error on destroy', () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('sidebar management', () => {
    it('should open sidebar', () => {
      component.open();
      expect(sidebarManagerService.openSidebar).toHaveBeenCalledWith('error');
    });

    it('should close sidebar', () => {
      component.close();
      expect(sidebarManagerService.closeSidebar).toHaveBeenCalled();
    });

    it('should check if sidebar is open', () => {
      (sidebarManagerService.getActiveSidebar as jest.Mock).mockReturnValue('error');
      expect(component.isOpen()).toBe(true);
      
      (sidebarManagerService.getActiveSidebar as jest.Mock).mockReturnValue(null);
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('error operations', () => {
    it('should clear all errors', () => {
      component.clearAll();
      expect(errorTrackingService.clearErrors).toHaveBeenCalled();
    });

    it('should copy error to clipboard', async () => {
      const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
      const error = mockErrors[0];
      
      await component.copyError(error);
      
      expect(writeTextSpy).toHaveBeenCalled();
      const copiedText = writeTextSpy.mock.calls[0][0];
      expect(copiedText).toContain('Test error 1');
      expect(copiedText).toContain('404');
      
      writeTextSpy.mockRestore();
    });
  });

  describe('utility methods', () => {
    it('should format relative time correctly', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const result = component.getRelativeTime(oneHourAgo);
      expect(result).toContain('hour');
    });

    it('should format full timestamp', () => {
      const date = new Date('2024-01-01T12:00:00');
      const result = component.getFullTimestamp(date);
      expect(result).toBeTruthy();
    });
  });
});
