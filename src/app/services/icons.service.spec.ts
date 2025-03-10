import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsService } from './icons.service';

describe('IconsService', () => {
  let service: IconsService;
  let matIconRegistryMock: jasmine.SpyObj<MatIconRegistry>;
  let domSanitizerMock: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    matIconRegistryMock = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
    domSanitizerMock = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    
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
    domSanitizerMock.bypassSecurityTrustResourceUrl.and.returnValue('sanitized-url');
    
    // Act
    const result = service.loadIcon(iconName);
    
    // Assert
    expect(result).toBeTrue();
    expect(domSanitizerMock.bypassSecurityTrustResourceUrl)
      .toHaveBeenCalledWith('assets/img/test-icon.svg');
    expect(matIconRegistryMock.addSvgIcon)
      .toHaveBeenCalledWith(iconName, 'sanitized-url');
  });

  it('should not load the same icon twice', () => {
    // Arrange
    const iconName = 'test-icon';
    domSanitizerMock.bypassSecurityTrustResourceUrl.and.returnValue('sanitized-url');
    
    // Act
    service.loadIcon(iconName); // First load
    const result = service.loadIcon(iconName); // Second load
    
    // Assert
    expect(result).toBeFalse();
    expect(matIconRegistryMock.addSvgIcon).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when loading icons', () => {
    // Arrange
    const iconName = 'error-icon';
    domSanitizerMock.bypassSecurityTrustResourceUrl.and.throwError('Test error');
    spyOn(console, 'error');
    
    // Act
    const result = service.loadIcon(iconName);
    
    // Assert
    expect(result).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });
});
