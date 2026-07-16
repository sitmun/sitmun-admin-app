import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, firstValueFrom } from 'rxjs';

import { FormToolbarComponent } from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import {
  ApplicationService,
  CodeListService,
  RoleService,
  TerritoryService,
  TranslationService,
  UserConfigurationService,
  UserPositionService,
  UserService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import { LoggerService } from '@app/services/logger.service';
import { configureLoggerForTests, provideErrorHandlerForTests } from '@app/testing/test-helpers';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let applicationService: ApplicationService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [UserFormComponent, FormToolbarComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([], {}),
        SitmunFrontendGuiModule,
        MaterialModule,
        MatIconTestingModule,
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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        UserService,
        UserConfigurationService,
        UserPositionService,
        RoleService,
        TerritoryService,
        ApplicationService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    applicationService = TestBed.inject(ApplicationService);
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Grid capability classification', () => {
    it('userConfigurationsTable should have picker, updater, and status capabilities (dual-target)', () => {
      const table = component['userConfigurationsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('userPositionsTable should have picker, updater, and status capabilities', () => {
      const table = component['userPositionsTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('applicationsAsContactTable should be read-only display grid with no edit capabilities', () => {
      const table = component['applicationsAsContactTable'];
      expect(table.hasPickerAdd()).toBe(false);
      expect(table.hasRelationsUpdater()).toBe(false);
      expect(table.hasStatusColumn()).toBe(false);
      expect(table.hasTemplateDialogs()).toBe(false);
      expect(table.supportsDuplicate()).toBe(false);
    });
  });

  describe('userPositionsTable column types', () => {
    it('territoryName links to territory form via territoryId', () => {
      const columns = component['userPositionsTable'].relationsColumnsDefs;
      const col = columns.find((c: any) => c.field === 'territoryName');
      expect(col?.cellRenderer).toBe('routerLinkRenderer');
      expect(col?.cellRendererParams?.paramFields).toEqual({ id: 'territoryId' });
    });
  });

  describe('applicationsAsContactTable fetcher', () => {
    it('returns empty when not in edition mode', async () => {
      jest.spyOn(component, 'isEdition').mockReturnValue(false);
      const apps = await firstValueFrom(component['applicationsAsContactTable'].relationsFetchFn());
      expect(apps).toEqual([]);
    });

    it('delegates to applicationService.findByCreatorId in edition mode', async () => {
      component.entityID = 99;
      jest.spyOn(component, 'isEdition').mockReturnValue(true);
      const expected = [{ id: 1, name: 'App A' }];
      jest.spyOn(applicationService, 'findByCreatorId').mockReturnValue(of(expected as any));

      const apps = await firstValueFrom(component['applicationsAsContactTable'].relationsFetchFn());

      expect(applicationService.findByCreatorId).toHaveBeenCalledWith(99);
      expect(apps).toEqual(expected);
    });
  });
});
