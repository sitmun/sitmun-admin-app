import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { TranslateService , TranslateModule } from '@ngx-translate/core';

import { LoggerService } from '@app/services/logger.service';

import { ErrorPageComponent } from './error-page.component';


describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let loggerService: jest.Mocked<LoggerService>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock console.error to prevent console output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    loggerService = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      setLogLevel: jest.fn(),
      getLogLevel: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatTooltipModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: TranslateService, useValue: { instant: jest.fn() } },
        { provide: LoggerService, useValue: loggerService }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process string error correctly', () => {
    component.error = 'Test error message';
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Test error message');
    expect(loggerService.error).toHaveBeenCalledWith('Error page displayed', {
      error: 'Test error message',
      errorType: 'general'
    });
  });

  it('should process error object with message', () => {
    component.error = { message: 'Test error message' };
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Test error message');
    expect(loggerService.error).toHaveBeenCalledWith('Error page displayed', {
      error: { message: 'Test error message' },
      errorType: 'general'
    });
  });

  it('should toggle details visibility', () => {
    expect(component.showDetails).toBeFalsy();
    
    component.toggleDetails();
    expect(component.showDetails).toBeTruthy();
    
    component.toggleDetails();
    expect(component.showDetails).toBeFalsy();
  });

  it('should call window.location.reload on retry', () => {
    // Create a mock location object
    const mockReload = jest.fn();
    const originalLocation = window.location;
    
    // Replace window.location with a mock
    delete (window as any).location;
    (window as any).location = {
      ...originalLocation,
      reload: mockReload
    };
    
    component.retry();
    expect(mockReload).toHaveBeenCalled();
    
    // Restore original location
    (window as any).location = originalLocation;
  });
}); 