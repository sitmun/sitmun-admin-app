import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { LogLevel } from './log-level.enum';
import { environment } from '@environments/environment';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService]
    });
    service = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    // Restore all console spies after each test
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with log level from environment', () => {
    expect(service.getLogLevel()).toBe(environment.logLevel || LogLevel.Error);
  });

  it('should set and get log level', () => {
    service.setLogLevel(LogLevel.Debug);
    expect(service.getLogLevel()).toBe(LogLevel.Debug);

    service.setLogLevel(LogLevel.Info);
    expect(service.getLogLevel()).toBe(LogLevel.Info);
  });

  describe('error method', () => {
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    it('should log error messages when log level is Error or higher', () => {
      service.setLogLevel(LogLevel.Error);
      service.error('Test error message');
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Error] Test error message');
    });

    it('should not log error messages when log level is below Error', () => {
      service.setLogLevel(LogLevel.Off);
      service.error('Test error message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log error messages with additional data', () => {
      service.setLogLevel(LogLevel.Error);
      const additionalData = { id: 1, name: 'test' };
      service.error('Test error message', additionalData);
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Error] Test error message');
      expect(consoleSpy.mock.calls[0][1]).toBe(additionalData);
    });
  });

  describe('warn method', () => {
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    it('should log warning messages when log level is Warning or higher', () => {
      service.setLogLevel(LogLevel.Warning);
      service.warn('Test warning message');
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Warning] Test warning message');
    });

    it('should not log warning messages when log level is below Warning', () => {
      service.setLogLevel(LogLevel.Error);
      service.warn('Test warning message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log warning messages with additional data', () => {
      service.setLogLevel(LogLevel.Warning);
      const additionalData = { id: 1, name: 'test' };
      service.warn('Test warning message', additionalData);
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Warning] Test warning message');
      expect(consoleSpy.mock.calls[0][1]).toBe(additionalData);
    });
  });

  describe('info method', () => {
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    it('should log info messages when log level is Info or higher', () => {
      service.setLogLevel(LogLevel.Info);
      service.info('Test info message');
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Info] Test info message');
    });

    it('should not log info messages when log level is below Info', () => {
      service.setLogLevel(LogLevel.Warning);
      service.info('Test info message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log info messages with additional data', () => {
      service.setLogLevel(LogLevel.Info);
      const additionalData = { id: 1, name: 'test' };
      service.info('Test info message', additionalData);
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Info] Test info message');
      expect(consoleSpy.mock.calls[0][1]).toBe(additionalData);
    });
  });

  describe('debug method', () => {
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    it('should log debug messages when log level is Debug or higher', () => {
      service.setLogLevel(LogLevel.Debug);
      service.debug('Test debug message');
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Debug] Test debug message');
    });

    it('should not log debug messages when log level is below Debug', () => {
      service.setLogLevel(LogLevel.Info);
      service.debug('Test debug message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log debug messages with additional data', () => {
      service.setLogLevel(LogLevel.Debug);
      const additionalData = { id: 1, name: 'test' };
      service.debug('Test debug message', additionalData);
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Debug] Test debug message');
      expect(consoleSpy.mock.calls[0][1]).toBe(additionalData);
    });
  });

  describe('trace method', () => {
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    it('should log trace messages when log level is Trace', () => {
      service.setLogLevel(LogLevel.Trace);
      service.trace('Test trace message');
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Trace] Test trace message');
    });

    it('should not log trace messages when log level is below Trace', () => {
      service.setLogLevel(LogLevel.Debug);
      service.trace('Test trace message');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log trace messages with additional data', () => {
      service.setLogLevel(LogLevel.Trace);
      const additionalData = { id: 1, name: 'test' };
      service.trace('Test trace message', additionalData);
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy.mock.calls[0][0]).toContain('[Trace] Test trace message');
      expect(consoleSpy.mock.calls[0][1]).toBe(additionalData);
    });
  });

  describe('multiple log levels', () => {
    it('should log all message types when log level is Trace', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const infoSpy = jest.spyOn(console, 'info').mockImplementation();
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      service.setLogLevel(LogLevel.Trace);
      
      service.error('Error message');
      service.warn('Warning message');
      service.info('Info message');
      service.debug('Debug message');
      service.trace('Trace message');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(2); // Both debug and trace use console.log
    });

    it('should only log error messages when log level is Error', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const infoSpy = jest.spyOn(console, 'info').mockImplementation();
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      service.setLogLevel(LogLevel.Error);
      
      service.error('Error message');
      service.warn('Warning message');
      service.info('Info message');
      service.debug('Debug message');
      service.trace('Trace message');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('timestamp format', () => {
    it('should include ISO timestamp in log messages', () => {
      const dateSpy = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-01-01T12:00:00.000Z');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      service.setLogLevel(LogLevel.Error);
      service.error('Test message');
      
      expect(consoleSpy).toHaveBeenCalledWith('[2023-01-01T12:00:00.000Z] [Error] Test message');
    });
  });
}); 