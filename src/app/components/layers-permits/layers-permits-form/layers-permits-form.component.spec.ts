import { readFileSync } from 'fs';
import { join } from 'path';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  CartographyGroupService,
  CartographyService,
  CodeList,
  CodeListService,
  RoleService,
  TranslationService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';
import {constants} from '@environments/constants';

import { LayersPermitsFormComponent } from './layers-permits-form.component';

const layersPermitsFormTemplate = readFileSync(
  join(__dirname, 'layers-permits-form.component.html'),
  'utf8',
);

describe('LayersPermitsFormComponent', () => {
  let component: LayersPermitsFormComponent;
  let fixture: ComponentFixture<LayersPermitsFormComponent>;

  let _consoleErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ LayersPermitsFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([], {}), SitmunFrontendGuiModule, EntityFormAlertsComponent,
      MaterialModule, RouterModule, MatIconTestingModule, BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: () => ({
            getTranslation: () => of({})
          })
        }
      })],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideErrorHandlerForTests(),
        CartographyGroupService,
        RoleService,
        CartographyService,
        CodeListService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    _consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fixture = TestBed.createComponent(LayersPermitsFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);

    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  

  it('requires a name and a type', () => {
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
    expect(component.entityForm.get('type')?.hasError('required')).toBe(true);
  });

  it('requires a name', () => {
    component.entityForm.patchValue({
      type: 1,
    });
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
  });

  it('accepts a name and a type', () => {
    component.entityForm.patchValue({
      name: 'name',
      type: 1,
    });
    expect(component.entityForm.valid).toBe(true);
  });

  it('includes the current entity type in the select options even when filtered out for new permits', () => {
    const codeList = (value: string, description: string, defaultCode = false): CodeList =>
      Object.assign(new CodeList(), { value, description, defaultCode });

    (component as any).codelists = new Map([
      ['cartographyPermission.type', [
        codeList(constants.codeValue.cartographyPermissionType.backgroundMap, 'Background map'),
        codeList(constants.codeValue.cartographyPermissionType.cartographyGroup, 'Cartography group', true),
        codeList(constants.codeValue.cartographyPermissionType.locationMap, 'Location map'),
        codeList(constants.codeValue.cartographyPermissionType.report, 'Report'),
      ]],
    ]);
    component.entityToEdit = Object.assign(component.empty(), {
      name: 'Background Map',
      type: constants.codeValue.cartographyPermissionType.backgroundMap,
    });

    (component as any).refreshPermissionGroupTypes(component.entityToEdit.type);
    component.postFetchData();

    expect(component.permissionGroupTypes.map(item => item.value)).toEqual(
      expect.arrayContaining([
        constants.codeValue.cartographyPermissionType.cartographyGroup,
        constants.codeValue.cartographyPermissionType.backgroundMap,
        constants.codeValue.cartographyPermissionType.report,
        constants.codeValue.cartographyPermissionType.locationMap,
      ])
    );
    expect(component.entityForm.get('type')?.value)
      .toBe(constants.codeValue.cartographyPermissionType.backgroundMap);
  });

  describe('Grid capability classification', () => {
    it('membersTable should have picker, updater, and status capabilities', () => {
      const table = component['membersTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('rolesTable should have picker, updater, and status capabilities', () => {
      const table = component['rolesTable'];
      expect(table.hasPickerAdd()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.hasTemplateDialogs()).toBe(false);
    });

    it('no grids in this form should be read-only', () => {
      const membersTable = component['membersTable'];
      const rolesTable = component['rolesTable'];
      
      expect(membersTable.hasRelationsUpdater()).toBe(true);
      expect(rolesTable.hasRelationsUpdater()).toBe(true);
    });
  });

  describe('Picker deduplication', () => {
    it('rolesTable excludes already-added roles from the picker', () => {
      const relations = [{ id: 10 }, { id: 20 }] as any;
      const predicate = (component['rolesTable'] as any).targetIncludeFn(relations);
      expect(predicate({ id: 10 })).toBe(false);
      expect(predicate({ id: 30 })).toBe(true);
    });
  });

  describe('template markup', () => {
    it('uses name maxlength, character count, required error, and card-wrapped relation grids', () => {
      expect(layersPermitsFormTemplate).toContain('[maxlength]="50"');
      expect(layersPermitsFormTemplate).toContain('characterCount');
      expect(layersPermitsFormTemplate).toContain("'common.error.required'");
      expect(layersPermitsFormTemplate).toMatch(/<mat-card[\s\S]*<app-relation-grid/);
    });
  });
});
