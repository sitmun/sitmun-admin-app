import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter, RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityListComponent} from '@app/components/shared/entity-list/entity-list.component';
import {ExternalConfigurationService} from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import { Application, ApplicationService, CodeListService, TranslationService } from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';

import { ApplicationComponent } from './application.component';


describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;
  let applicationService: ApplicationService;
  let codeListService: CodeListService;
  let resourceService: ResourceService;
  let externalService: ExternalService;
  let httpMock: HttpTestingController;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ ApplicationComponent, EntityListComponent ],
      imports : [SitmunFrontendGuiModule, MaterialModule, MatIconTestingModule, RouterModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [
        ApplicationService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();
  });

  beforeEach(async () => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    applicationService = TestBed.inject(ApplicationService);
    codeListService = TestBed.inject(CodeListService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    httpMock.verify();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should instantiate applicationService', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });


  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });

  describe('warnings column', () => {
    beforeEach(async () => {
      await component.postFetchData();
    });

    it('defines a narrow warnings column after the checkbox', () => {
      const fields = component.entityListConfig.columnDefs.map((c: any) => c.field);
      expect(fields).toContain('warnings');
      const warningsCol = component.entityListConfig.columnDefs.find((c: any) => c.field === 'warnings');
      expect(warningsCol.width).toBe(48);
      expect(warningsCol.sortable).toBe(false);
      expect(warningsCol.filter).toBe(false);
      expect(warningsCol.editable).toBe(false);
      const checkboxIndex = component.entityListConfig.columnDefs.findIndex(
        (c: any) => c.field === '__loadingSelection' || c.checkboxSelection
      );
      const warningsIndex = component.entityListConfig.columnDefs.findIndex(
        (c: any) => c.field === 'warnings'
      );
      expect(warningsIndex).toBe(checkboxIndex + 1);
    });

    it('renders no icon when warnings are null or empty', () => {
      const warningsCol: any = component.entityListConfig.columnDefs.find((c: any) => c.field === 'warnings');
      expect(warningsCol.cellRenderer({ data: { warnings: null } })).toBe('');
      expect(warningsCol.cellRenderer({ data: { warnings: [] } })).toBe('');
    });

    it('renders one accessible warning icon when warnings exist', () => {
      const warningsCol: any = component.entityListConfig.columnDefs.find((c: any) => c.field === 'warnings');
      const icon = warningsCol.cellRenderer({
        data: {
          warnings: [
            'entity.application.warning.invalid-point-of-contact',
            'entity.application.warning.point-of-contact-email-missing',
          ],
        },
      }) as HTMLElement;
      expect(icon).toBeTruthy();
      expect(icon.classList.contains('material-icons')).toBe(true);
      expect(icon.textContent).toBe('warning_amber');
      expect(icon.getAttribute('aria-label')).toBeTruthy();
      expect(icon.getAttribute('title')).toBe(icon.getAttribute('aria-label'));
      expect(icon.getAttribute('aria-label')).toContain('\n');
    });

    it('hydrates warnings through Application.fromObject for list rows', () => {
      expect(component.entityListConfig.infiniteBlockFetcher).toBeDefined();
      const mapped = Application.fromObject({
        type: 'I',
        warnings: ['entity.application.warning.invalid-point-of-contact'],
      });
      expect(mapped.warnings).toEqual(['entity.application.warning.invalid-point-of-contact']);
    });
  });

});




