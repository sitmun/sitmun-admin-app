import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToolbarComponent } from './toolbar.component';
import { MaterialModule } from '../../../material-module';
import { LoginService, AuthService, Principal, AccountService, ResourceService,ExternalService } from '../../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../../frontend-gui/src/lib/public_api';
describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let loginService: LoginService;
  let authService: AuthService;
  let accountService: AccountService;
  let principal: Principal;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports: [MaterialModule, HttpClientTestingModule,HttpClientModule, RouterTestingModule, SitmunFrontendGuiModule, MatIconTestingModule,],      
      providers: [  LoginService, AuthService, Principal, AccountService, ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    loginService= TestBed.inject(LoginService);
    authService= TestBed.inject(AuthService);
    accountService= TestBed.inject(AccountService);
    principal= TestBed.inject(Principal);
    resourceService= TestBed.inject(ResourceService);
    externalService= TestBed.inject(ExternalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should instantiate loginService', () => {
    expect(loginService).toBeTruthy();
  });

  it('should instantiate authService', () => {
    expect(authService).toBeTruthy();
  });

  it('should instantiate accountService', () => {
    expect(accountService).toBeTruthy();
  });

  it('should instantiate principal', () => {
    expect(principal).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });
});
