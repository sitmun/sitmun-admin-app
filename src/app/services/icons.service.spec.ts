import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsService } from './icons.service';

describe('IconsService', () => {
  let service: IconsService;
  let matIconRegistryMock: jest.Mocked<MatIconRegistry>;
  let domSanitizerMock: jest.Mocked<DomSanitizer>;

  beforeEach(() => {
    // Create Jest mocks instead of Jasmine spy objects
    matIconRegistryMock = {
      addSvgIcon: jest.fn()
    } as unknown as jest.Mocked<MatIconRegistry>;
    
    domSanitizerMock = {
      bypassSecurityTrustResourceUrl: jest.fn()
    } as unknown as jest.Mocked<DomSanitizer>;
    
    TestBed.configureTestingModule({
      providers: [
        IconsService,
        { provide: MatIconRegistry, useValue: matIconRegistryMock },
        { provide: DomSanitizer, useValue: domSanitizerMock }
      ]
    });
    
    service = TestBed.inject(IconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load an icon successfully', () => {
    // Arrange
    const iconName = 'test-icon';
    domSanitizerMock.bypassSecurityTrustResourceUrl.mockReturnValue('sanitized-url');
    
    // Act
    const result = service.loadIcon(iconName);
    
    // Assert
    expect(result).toBe(true);
    expect(domSanitizerMock.bypassSecurityTrustResourceUrl)
      .toHaveBeenCalledWith('assets/img/test-icon.svg');
    expect(matIconRegistryMock.addSvgIcon)
      .toHaveBeenCalledWith(iconName, 'sanitized-url');
  });

  it('should not load the same icon twice', () => {
    // Arrange
    const iconName = 'test-icon';
    domSanitizerMock.bypassSecurityTrustResourceUrl.mockReturnValue('sanitized-url');
    
    // Act
    service.loadIcon(iconName); // First load
    const result = service.loadIcon(iconName); // Second load
    
    // Assert
    expect(result).toBe(false);
    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when loading icons', () => {
    // Arrange
    const iconName = 'error-icon';
    domSanitizerMock.bypassSecurityTrustResourceUrl.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Act
    const result = service.loadIcon(iconName);
    
    // Assert
    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Clean up
    consoleErrorSpy.mockRestore();
  });
});
