import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SideMenuComponent } from '@app/components/shared/side-menu/side-menu.component';
import { ToolbarComponent } from '@app/components/shared/toolbar/toolbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MaterialModule } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExternalService, LanguageService, ResourceService } from '@app/frontend-core/src/lib/public_api';
import { AccountService } from '@app/core/account/account.service';
import { Principal } from '@app/core/auth/principal.service';
import { LoginService } from '@app/core/auth/login.service';
import { AuthService } from '@app/core/auth/auth.service';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/sitmun-frontend-gui.module';

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
            useFactory: (http: HttpClient) => {
              return new TranslateHttpLoader(http, './assets/i18n/', '.json');
            },
            deps: [HttpClient]
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
