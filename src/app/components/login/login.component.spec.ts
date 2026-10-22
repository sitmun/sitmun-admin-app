import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {ExternalService, ResourceService} from '@app/core/hal/services';
import { CodeListService, LanguageService, TranslationService } from '@app/domain';

import { LoginComponent } from './login.component';
import { AccountService , AuthService , LoginService , Principal , ExternalConfigurationService } from '../../core';
import { SitmunFrontendGuiModule } from '../../frontend-gui/src/lib/public_api';
import { MaterialModule } from '../../material-module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ LoginComponent ],
      imports : [
        FormsModule,
        ReactiveFormsModule,
        SitmunFrontendGuiModule,
        MatIconTestingModule,
        MaterialModule,
        RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        LoginService,
        AuthService,
        CodeListService,
        LanguageService,
        Principal,
        AccountService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  

  it('requires a username and a password', () => {
    expect(component.form.get('username')?.hasError('required')).toBe(true);
    expect(component.form.get('password')?.hasError('required')).toBe(true);
  });

  it('requires a username', () => {
    component.form.patchValue({
      password: 'password',
    });
    expect(component.form.get('username')?.hasError('required')).toBe(true);
  });

  it('accepts a username and a password', () => {
    component.form.patchValue({
      username: 'username',
      password: 'password',
    });
    expect(component.form.valid).toBe(true);
  });
});
