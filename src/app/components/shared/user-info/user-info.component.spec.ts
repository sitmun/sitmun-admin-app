import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { Principal } from '@app/core/auth/principal.service';
import { LoginService } from '@app/core/auth/login.service';
import { User } from '@app/domain';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let principalMock: any;
  let loginServiceMock: any;
  let mockUser: any;

  beforeEach(async () => {
    // Create mock user with only the properties needed for the tests
    mockUser = {
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      // Add required Resource properties
      _links: { self: { href: 'api/users/1' } },
      _subtypes: new Map<string, any>(),
      subtypes: new Map<string, any>(),
      getRelationArray: jest.fn(),
      getRelation: jest.fn(),
      addRelation: jest.fn(),
      updateRelation: jest.fn(),
      substituteRelation: jest.fn(),
      substituteAllRelation: jest.fn(),
      deleteRelation: jest.fn(),
      deleteAllRelation: jest.fn()
    };

    // Create mock services
    principalMock = {
      identity: jest.fn().mockResolvedValue(mockUser),
      getAuthenticationState: jest.fn().mockReturnValue(of({}))
    };

    loginServiceMock = {
      logout: jest.fn()
    };

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn()
      },
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
      imports: [
        MatMenuModule,
        MatIconModule,
        NoopAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Principal, useValue: principalMock },
        { provide: LoginService, useValue: loginServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(principalMock.identity).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should subscribe to authentication state changes', () => {
    expect(principalMock.getAuthenticationState).toHaveBeenCalled();
  });

  it('should reload user when authentication state changes', () => {
    // Reset the identity mock call count
    principalMock.identity.mockClear();
    
    // Trigger the subscription callback
    component.ngOnInit();
    
    // The identity method should be called again
    expect(principalMock.identity).toHaveBeenCalled();
  });

  it('should call logout service and reload page when logout is called', () => {
    component.logout();
    
    expect(loginServiceMock.logout).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should display user full name when both first and last name are available', () => {
    component.currentUser = {
      ...mockUser,
      firstName: 'John',
      lastName: 'Doe'
    };
    
    expect(component.getUserFullName()).toBe('John Doe');
  });

  it('should display only first name when last name is not available', () => {
    component.currentUser = {
      ...mockUser,
      firstName: 'John',
      lastName: undefined
    };
    
    expect(component.getUserFullName()).toBe('John');
  });

  it('should display only last name when first name is not available', () => {
    component.currentUser = {
      ...mockUser,
      firstName: undefined,
      lastName: 'Doe'
    };
    
    expect(component.getUserFullName()).toBe('Doe');
  });

  it('should display username when neither first nor last name is available', () => {
    component.currentUser = {
      ...mockUser,
      firstName: undefined,
      lastName: undefined,
      username: 'johndoe'
    };
    
    expect(component.getUserFullName()).toBe('johndoe');
  });

  it('should return empty string when currentUser is null', () => {
    component.currentUser = null;
    
    expect(component.getUserFullName()).toBe('');
  });

  it('should display the user full name in the UI', () => {
    component.currentUser = mockUser;
    fixture.detectChanges();
    
    const buttonText = fixture.debugElement.query(By.css('.toolbar-text')).nativeElement.textContent;
    expect(buttonText.trim()).toBe('Test User');
  });

  it('should have a logout button in the menu', () => {
    // Open the menu
    const button = fixture.debugElement.query(By.css('button[mat-button]')).nativeElement;
    button.click();
    fixture.detectChanges();
    
    // Find the logout button
    const menuItems = document.querySelectorAll('button[mat-menu-item]');
    expect(menuItems.length).toBe(1);
    
    // Check that clicking the logout button calls the logout method
    jest.spyOn(component, 'logout');
    (menuItems[0] as HTMLElement).click();
    expect(component.logout).toHaveBeenCalled();
  });
}); 