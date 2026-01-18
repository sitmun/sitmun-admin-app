import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests } from '@app/testing/test-helpers';

import { SideMenuComponent } from './side-menu.component';
import { APP_ROUTES } from '../../../app-routes';


describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuComponent ],
      imports: [HttpClientTestingModule, MatIconTestingModule, MaterialModule, RouterModule.forRoot(APP_ROUTES, {}),
         BrowserAnimationsModule, MatIconTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => ({
            getTranslation: () => of({})
          })
        }
      })],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();
    
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
