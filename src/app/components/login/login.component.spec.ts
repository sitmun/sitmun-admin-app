import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SitmunFrontendGuiModule } from '../../frontend-gui/src/lib/public_api';
import { LoginService, AuthService, CodeListService,Principal, AccountService,TranslationService,ResourceService, ExternalService } from '../../frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  let authService: AuthService;
  let accountService: AccountService;
  let principal: Principal;
  let codeListService: CodeListService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports : [FormsModule, ReactiveFormsModule, HttpClientTestingModule, HttpClientModule,  SitmunFrontendGuiModule, RouterTestingModule, MatIconTestingModule,
        MaterialModule, RouterModule,
       TranslateModule.forRoot({
         loader: {
           provide: TranslateLoader,
           useFactory: (http: HttpClient) => {
             return new TranslateHttpLoader(http, './assets/i18n/', '.json');
           },
           deps: [HttpClient]
           }
       })],
     providers: [LoginService, AuthService, CodeListService,Principal, AccountService,TranslationService,ResourceService,ExternalService,
       { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
   }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService= TestBed.inject(LoginService);
    authService= TestBed.inject(AuthService);
    accountService= TestBed.inject(AccountService);
    principal= TestBed.inject(Principal);
    codeListService= TestBed.inject(CodeListService);
    translationService= TestBed.inject(TranslationService);
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

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate translationService', () => {
    expect(translationService).toBeTruthy();
  });
 
  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  }); 

  it('form invalid when mid-empty', () => {
    component.form.patchValue({
      password: 'password',
      lang: 1,
    })
    //Miss username
    expect(component.form.valid).toBeFalsy();
  }); 

  it('form valid', () => {
    component.form.patchValue({
      username: 'username',
      password: 'password',
      lang: 1,
    })
    expect(component.form.valid).toBeTruthy();
  }); 
});
