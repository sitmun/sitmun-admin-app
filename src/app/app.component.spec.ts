import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SideMenuComponent } from './components/shared/side-menu/side-menu.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MaterialModule } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExternalService,Principal,LoginService,AccountService,AuthService, LanguageService,ResourceService } from './frontend-core/src/lib/public_api';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { SitmunFrontendGuiModule } from './frontend-gui/src/lib/sitmun-frontend-gui.module';

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
      providers: [Principal,LoginService,AccountService,AuthService,LanguageService, ResourceService, ExternalService ,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
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