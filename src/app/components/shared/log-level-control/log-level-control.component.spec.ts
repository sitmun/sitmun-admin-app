import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogLevelControlComponent } from './log-level-control.component';
import { LoggerService } from '../../../services/logger.service';
import { LogLevel } from '../../../services/log-level.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('LogLevelControlComponent', () => {
  let component: LogLevelControlComponent;
  let fixture: ComponentFixture<LogLevelControlComponent>;
  let loggerService: LoggerService;

  beforeEach(async () => {
    // Create a mock LoggerService
    const loggerServiceMock = {
      getLogLevel: jest.fn().mockReturnValue(LogLevel.Info),
      setLogLevel: jest.fn(),
      info: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LogLevelControlComponent],
      imports: [
        MatMenuModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: LoggerService, useValue: loggerServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    loggerService = TestBed.inject(LoggerService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogLevelControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the current log level from LoggerService', () => {
    expect(component.currentLogLevel).toBe(LogLevel.Info);
    expect(loggerService.getLogLevel).toHaveBeenCalled();
  });

  it('should change log level when onLogLevelChange is called', () => {
    component.onLogLevelChange(LogLevel.Debug);
    
    expect(loggerService.setLogLevel).toHaveBeenCalledWith(LogLevel.Debug);
    expect(component.currentLogLevel).toBe(LogLevel.Debug);
    expect(loggerService.info).toHaveBeenCalledWith('Log level changed to Debug');
  });

  it('should return correct log level name', () => {
    expect(component.getLogLevelName(LogLevel.Error)).toBe('Error');
    expect(component.getLogLevelName(LogLevel.Warning)).toBe('Warning');
    expect(component.getLogLevelName(LogLevel.Info)).toBe('Info');
    expect(component.getLogLevelName(LogLevel.Debug)).toBe('Debug');
    expect(component.getLogLevelName(LogLevel.Trace)).toBe('Trace');
    expect(component.getLogLevelName(LogLevel.Off)).toBe('Off');
  });

  it('should return correct icon for each log level', () => {
    expect(component.getIconForLevel(LogLevel.Off)).toBe('block');
    expect(component.getIconForLevel(LogLevel.Error)).toBe('error');
    expect(component.getIconForLevel(LogLevel.Warning)).toBe('warning');
    expect(component.getIconForLevel(LogLevel.Info)).toBe('info');
    expect(component.getIconForLevel(LogLevel.Debug)).toBe('bug_report');
    expect(component.getIconForLevel(LogLevel.Trace)).toBe('track_changes');
    expect(component.getIconForLevel(99 as LogLevel)).toBe('settings'); // Default case
  });

  it('should display the current log level in the button', () => {
    component.currentLogLevel = LogLevel.Warning;
    fixture.detectChanges();
    
    const buttonText = fixture.debugElement.query(By.css('.toolbar-text')).nativeElement.textContent;
    expect(buttonText.trim()).toBe('Warning');
  });

  it('should have menu items for all log levels', () => {
    // Open the menu
    const button = fixture.debugElement.query(By.css('button[mat-button]')).nativeElement;
    button.click();
    fixture.detectChanges();
    
    // Check that we have menu items for all log levels
    const menuItems = document.querySelectorAll('button[mat-menu-item]');
    expect(menuItems.length).toBe(component.logLevels.length);
    
    // Check the text content of each menu item
    component.logLevels.forEach((level, index) => {
      expect(menuItems[index].textContent).toContain(level.name);
    });
  });
}); 