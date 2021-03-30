import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { LoginService } from 'dist/sitmun-frontend-core/';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { AuthService, CodeListService,Principal, AccountService,TranslationService } from 'dist/sitmun-frontend-core/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports : [HttpClientTestingModule, HttpClientModule,  SitmunFrontendGuiModule, RouterTestingModule, MatIconTestingModule,
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
     providers: [LoginService, AuthService, CodeListService,Principal, AccountService,TranslationService,
       { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
   }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
