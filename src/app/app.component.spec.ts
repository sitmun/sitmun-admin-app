import { HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { SideMenuComponent } from '@app/components/shared/side-menu/side-menu.component';
import { ToolbarComponent } from '@app/components/shared/toolbar/toolbar.component';
import { AccountService } from '@app/core/account/account.service';
import { AuthService } from '@app/core/auth/auth.service';
import { LoginService } from '@app/core/auth/login.service';
import { Principal } from '@app/core/auth/principal.service';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal/services';
import { LanguageService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/sitmun-frontend-gui.module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests } from '@app/testing/test-helpers';

import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        MatIconTestingModule,
        MaterialModule,
        SitmunFrontendGuiModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      declarations: [
        AppComponent,
        SideMenuComponent,
        ToolbarComponent
      ],
      providers: [
        Principal,
        LoginService,
        AccountService,
        AuthService,
        LanguageService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ]
    }).compileComponents();
    
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'admin-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('admin-app');
  });
});
