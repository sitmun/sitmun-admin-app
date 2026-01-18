import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';


import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import { CodeListService, TranslationService, UserService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';

import { EntityListComponent } from './shared/entity-list/entity-list.component';
import { UserComponent } from './user/user.component';

describe('BaseListComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent, EntityListComponent],
      imports: [
        HttpClientTestingModule,
        MatIconTestingModule,
        SitmunFrontendGuiModule,
        RouterTestingModule,
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
        UserService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        ErrorHandlerService,
        LoadingOverlayService,
        LoggerService,
        UtilsService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default dataFetchFn behavior', () => {
    it('should have dataFetchFn defined', () => {
      // Test that dataFetchFn exists on the component
      // The actual default behavior (of([])) is tested in data-tables.util.spec.ts
      expect(component.dataFetchFn).toBeDefined();
      expect(typeof component.dataFetchFn).toBe('function');
    });
  });
});
