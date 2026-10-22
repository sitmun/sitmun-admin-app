
import { readFileSync } from 'fs';
import { join } from 'path';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of, throwError} from 'rxjs';

import {CardLeadComponent} from '@app/components/shared/card-lead/card-lead.component';
import {EntityFormAlertsComponent} from '@app/components/shared/entity-form-alerts/entity-form-alerts.component';
import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { FeatureFlagComponent } from '@app/core/features/feature-flag.component';
import { FeatureFlagDirective } from '@app/core/features/feature-flag.directive';
import { FeatureFlagPipe } from '@app/core/features/feature-flag.pipe';
import { FeatureFlagService } from '@app/core/features/feature-flag.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  CartographyAvailabilityService,
  CartographyFilterService,
  CartographyGroupService,
  CartographyParameterService,
  CartographyServiceParameterService,
  CartographyProjection,
  CartographyService,
  CartographySpatialSelectionParameterService,
  CartographyStyleService,
  CodeListService,
  ConnectionService,
  GetInfoService,
  ServiceService,
  TerritoryService,
  TerritoryTypeService,
  TranslationService,
  TreeNodeService
, CartographyGroupProjection } from '@app/domain';
import { CartographyParameter, persistedCartographyParameter } from '@app/domain/cartography/models/cartography-parameter.model';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';
import {constants} from '@environments/constants';

import { previewFeatureInfoFormat } from './feature-info-preview';
import { LayersFormComponent } from './layers-form.component';

const layersFormTemplate = readFileSync(join(__dirname, 'layers-form.component.html'), 'utf8');

describe('LayersFormComponent', () => {
  let component: LayersFormComponent;
  let fixture: ComponentFixture<LayersFormComponent>;
  let cartographyService: CartographyService;

  let getInfoService: GetInfoService;

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [
        LayersFormComponent,
        FormToolbarComponent,
        FeatureFlagDirective,
        FeatureFlagComponent,
        FeatureFlagPipe
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([], {}), SitmunFrontendGuiModule, EntityFormAlertsComponent, CardLeadComponent,
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
        FeatureFlagService,
        CartographyService,
        ServiceService,
        ConnectionService,
        TerritoryTypeService,
        TreeNodeService,
        GetInfoService,
        CartographyStyleService,
        TerritoryService,
        CartographyGroupService,
        CartographyAvailabilityService,
        CartographyParameterService,
        CartographyServiceParameterService,
        CartographySpatialSelectionParameterService,
        CodeListService,
        CartographyFilterService,
        TranslationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    cartographyService = TestBed.inject(CartographyService);

    getInfoService = TestBed.inject(GetInfoService);

    // Initialize form before detectChanges to prevent afterFetch from failing
    (component as unknown as {codelists: Map<string, unknown[]>}).codelists.set('cartographyParameter.format', []);
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  

  it('requires a name, a service, and a layer list', () => {
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
    expect(component.entityForm.get('serviceId')?.hasError('required')).toBe(true);
    expect(component.entityForm.get('joinedLayers')?.hasError('required')).toBe(true);
  });

  it('requires a name', () => {
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    component.entityForm.patchValue({
      serviceId: 1,
      joinedLayers: 'layer',
      minimumScale: 10,
      maximumScale: 20,
      order: 1,
      transparency: '50',
      metadataURL: 'url',
      legendType: 1,
      legendURL: 'url',
      source: 'source',
      description: 'description',
      datasetURL: 'dataset',
      applyFilterToGetMap: true,
      applyFilterToGetFeatureInfo: true,
      applyFilterToSpatialSelection: true,
      queryableFeatureEnabled: true,
      queryableFeatureAvailable: true,
      joinedQueryableLayers: 'queryableLayer',
      thematic: true,
      availableForClients: true,
      selectableFeatureEnabled: true,
      spatialSelectionServiceId: 1,
      joinedSelectableLayers: 'layerSelected',
      useAllStyles: true,
    });
    expect(component.entityForm.get('name')?.hasError('required')).toBe(true);
  });

  it('accepts a name, a service, and a layer list', () => {
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    component.entityForm.patchValue({
      name: 'name',
      serviceId: 1,
      joinedLayers: 'layer',
      minimumScale: 10,
      maximumScale: 20,
      order: 1,
      transparency: '50',
      metadataURL: 'url',
      legendType: 1,
      legendURL: 'url',
      source: 'source',
      description: 'description',
      datasetURL: 'dataset',
      applyFilterToGetMap: true,
      applyFilterToGetFeatureInfo: true,
      applyFilterToSpatialSelection: true,
      queryableFeatureEnabled: true,
      queryableFeatureAvailable: true,
      joinedQueryableLayers: 'queryableLayer',
      thematic: true,
      availableForClients: true,
      selectableFeatureEnabled: true,
      spatialSelectionServiceId: 1,
      joinedSelectableLayers: 'layerSelected',
      useAllStyles: true,
    });
    expect(component.entityForm.valid).toBe(true);
  });

  it('transparency defaults to 0 when not provided by the API', () => {
    component.entityID = -1;
    component.duplicateID = -1;
    component.entityToEdit = component.empty();
    component.postFetchData();
    expect(component.entityForm.get('transparency')?.value).toBe(0);
    expect(component.entityForm.get('transparency')?.valid).toBe(true);
  });

  it('transparency rejects values outside the 0..100 range', () => {
    component.entityID = -1;
    component.duplicateID = -1;
    component.entityToEdit = component.empty();
    component.postFetchData();
    const transparency = component.entityForm.get('transparency');
    transparency?.setValue(-1);
    expect(transparency?.valid).toBe(false);
    transparency?.setValue(101);
    expect(transparency?.valid).toBe(false);
    transparency?.setValue(50);
    expect(transparency?.valid).toBe(true);
  });

  it('availableForClients is inverse of API blocked on load and save', () => {
    component.entityID = 100;
    component.duplicateID = -1;
    component.entityToEdit = Object.assign(new CartographyProjection(), {
      blocked: false,
      name: 'layer',
      layers: ['x'],
      serviceId: 1
    });
    component.postFetchData();
    expect(component.entityForm.get('availableForClients')?.value).toBe(true);

    component.entityToEdit = Object.assign(new CartographyProjection(), {
      blocked: true,
      name: 'layer',
      layers: ['x'],
      serviceId: 1
    });
    component.postFetchData();
    expect(component.entityForm.get('availableForClients')?.value).toBe(false);

    component.entityForm.patchValue({
      name: 'layer',
      joinedLayers: 'x',
      serviceId: 1,
      availableForClients: true
    });
    const created = component.createObject(9);
    expect(created.blocked).toBe(false);

    component.entityForm.patchValue({ availableForClients: false });
    const createdBlocked = component.createObject(9);
    expect(createdBlocked.blocked).toBe(true);
  });

  it('new or duplicated layer defaults to blocked (not available for clients) until enabled', () => {
    component.entityID = -1;
    component.duplicateID = -1;
    component.entityToEdit = component.empty();
    component.postFetchData();
    expect(component.entityForm.get('availableForClients')?.value).toBe(false);
    component.entityForm.patchValue({
      name: 'n',
      joinedLayers: 'a',
      serviceId: 1
    });
    expect(component.createObject().blocked).toBe(true);

    component.duplicateID = 99;
    component.entityToEdit = Object.assign(new CartographyProjection(), {
      blocked: false,
      name: 'copy me',
      layers: ['x'],
      serviceId: 1
    });
    component.postFetchData();
    expect(component.entityForm.get('availableForClients')?.value).toBe(false);
    component.entityForm.patchValue({
      name: 'copy',
      joinedLayers: 'x',
      serviceId: 1
    });
    expect(component.createObject().blocked).toBe(true);
  });

  describe('createObject layer mapping', () => {
    const patchValidBasics = () => {
      component.entityForm.patchValue({
        name: 'name',
        serviceId: 1,
        joinedLayers: ' layer1 , layer2 ',
        joinedQueryableLayers: ' layer1 ',
        joinedSelectableLayers: ' layer2 ',
        spatialSelectionServiceId: 42,
      });
    };

    beforeEach(() => {
      component.entityID = 100;
      component.entityToEdit = Object.assign(new CartographyProjection(), {
        name: 'layer',
        layers: ['layer1'],
        serviceId: 1,
      });
      component.postFetchData();
    });

    it('maps joined form fields to trimmed layer arrays', () => {
      patchValidBasics();
      const created = component.createObject(100);
      expect(created.layers).toEqual(['layer1', 'layer2']);
      expect(created.queryableLayers).toEqual(['layer1']);
      expect(created.selectableLayers).toEqual(['layer2']);
    });

    it('preserves spatialSelectionServiceId as spatialSelectionService proxy', () => {
      patchValidBasics();
      const created = component.createObject(100);
      expect(created.spatialSelectionService?.id).toBe(42);
    });
  });

  describe('postFetchData load preservation', () => {
    it('does not clear joinedSelectableLayers when queryableFeatureEnabled is false', () => {
      component.entityID = 4393;
      component.entityToEdit = Object.assign(new CartographyProjection(), {
        name: 'layer',
        layers: ['x'],
        serviceId: 1,
        queryableFeatureEnabled: false,
        selectableLayers: ['a'],
      });
      component.postFetchData();
      expect(component.entityForm.get('joinedSelectableLayers')?.value).toBe('a');
    });
  });

  describe('queryable layer revalidation', () => {
    beforeEach(() => {
      component.entityID = 100;
      component.entityToEdit = Object.assign(new CartographyProjection(), {
        name: 'layer',
        layers: ['layer1', 'layer2'],
        serviceId: 1,
      });
      component.postFetchData();
      component.entityForm.patchValue({
        name: 'layer',
        serviceId: 1,
        joinedLayers: 'layer1,layer2',
        joinedQueryableLayers: 'layer1',
      });
    });

    it('revalidates joinedQueryableLayers when joinedLayers changes', () => {
      expect(component.entityForm.get('joinedQueryableLayers')?.valid).toBe(true);
      component.entityForm.patchValue({ joinedLayers: 'layer2' });
      expect(component.entityForm.get('joinedQueryableLayers')?.errors?.['invalidLayers']).toEqual(['layer1']);
    });

    it('does not throw when queryableLayersValidator receives a non-string probe value', () => {
      const control = component.entityForm.get('joinedQueryableLayers');
      expect(control?.validator).toBeTruthy();
      expect(() => control!.validator!(new FormControl({ length: Infinity }))).not.toThrow();
    });

    it('parseLayerList tolerates arrays and non-strings', () => {
      const parseLayerList = (component as unknown as {
        parseLayerList: (raw: unknown) => string[];
      }).parseLayerList.bind(component);
      expect(parseLayerList([' a ', '', 'b'])).toEqual(['a', 'b']);
      expect(parseLayerList({ length: Infinity })).toEqual([]);
      expect(parseLayerList(12)).toEqual([]);
    });
  });

  describe('style dialog mapping', () => {
    it('maps flat dialog values to nested legendURL', () => {
      const mapped = (component as any).toCartographyStyle({
        name: 'style-a',
        title: 'Style A',
        url: 'https://example.com/legend.png',
        format: 'image/png',
        width: 20,
        height: 20,
      });
      expect(mapped.legendURL).toEqual({
        format: 'image/png',
        width: 20,
        height: 20,
        onlineResource: 'https://example.com/legend.png',
      });
    });

    it('uses header i18n key for style add dialog title', () => {
      expect(component['stylesTable'].templateDialog('newStyleDialog').title)
        .toBe('entity.cartography.styles.parameters.header');
    });

    it('resets style dialog form on preOpen', () => {
      const dialog = component['stylesTable'].templateDialog('newStyleDialog');
      dialog.form.patchValue({
        name: 'old',
        title: 'Old',
        description: 'desc',
        format: 'png',
        width: 10,
        height: 10,
        url: 'http://example.com',
        defaultStyle: true,
      });
      dialog.preOpenFn(dialog.form);
      expect(dialog.form.value).toEqual({
        name: null,
        title: null,
        description: null,
        format: null,
        width: null,
        height: null,
        url: null,
        defaultStyle: false,
      });
    });
  });

  describe('permissions relation updater', () => {
    it('uses cartography proxy from entityID when linking permission groups', async () => {
      component.entityID = 4393;
      component.entityToEdit = Object.assign(new CartographyProjection(), { id: -1, name: 'stale' });

      const cartographyProxy = { id: 4393 };
      jest.spyOn(cartographyService, 'createProxy').mockReturnValue(cartographyProxy as any);

      const group = Object.assign(new CartographyGroupProjection(), {
        id: 1,
        name: 'perm-group',
        status: constants.entityStatus.pendingCreation,
        addRelationEx: jest.fn().mockReturnValue(of(null)),
        deleteRelationById: jest.fn().mockReturnValue(of(null)),
      });

      await component['cartographyPermissionsTable'].handleSaveRelations({
        event: 'save',
        data: [group as any],
      });

      expect(cartographyService.createProxy).toHaveBeenCalledWith(4393);
      expect(group.addRelationEx).toHaveBeenCalledWith('members', cartographyProxy);
    });
  });

  describe('scale validators', () => {
    const patchValidBasics = () => {
      component.entityForm.patchValue({
        name: 'name',
        serviceId: 1,
        joinedLayers: 'layer',
        order: 1,
        transparency: '50',
        metadataURL: 'url',
        legendType: 1,
        legendURL: 'url',
        source: 'source',
        description: 'description',
        datasetURL: 'dataset',
        applyFilterToGetMap: true,
        applyFilterToGetFeatureInfo: true,
        applyFilterToSpatialSelection: true,
        queryableFeatureEnabled: true,
        queryableFeatureAvailable: true,
        joinedQueryableLayers: 'queryableLayer',
        thematic: true,
        availableForClients: true,
        selectableFeatureEnabled: true,
        spatialSelectionServiceId: 1,
        joinedSelectableLayers: 'layerSelected',
        useAllStyles: true
      });
    };

    it('accepts empty min and max with otherwise valid form', () => {
      patchValidBasics();
      component.entityForm.patchValue({
        minimumScale: null,
        maximumScale: null
      });
      expect(component.entityForm.get('minimumScale')?.errors?.['scaleInteger']).toBeFalsy();
      expect(component.entityForm.errors?.['scaleRange']).toBeFalsy();
      expect(component.entityForm.valid).toBeTruthy();
    });

    it('accepts min 0 and max 0', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 0, maximumScale: 0 });
      expect(component.entityForm.valid).toBeTruthy();
      expect(component.entityForm.errors?.['scaleRange']).toBeFalsy();
    });

    it('accepts min 0 and max positive', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 0, maximumScale: 50000 });
      expect(component.entityForm.valid).toBeTruthy();
    });

    it('accepts min positive and max 0', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 200, maximumScale: 0 });
      expect(component.entityForm.valid).toBeTruthy();
    });

    it('rejects when both positive and max equals min', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 200, maximumScale: 200 });
      expect(component.entityForm.errors?.['scaleRange']).toBeTruthy();
      expect(component.entityForm.valid).toBeFalsy();
    });

    it('rejects when both positive and max less than min', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 50000, maximumScale: 200 });
      expect(component.entityForm.errors?.['scaleRange']).toBeTruthy();
      expect(component.entityForm.valid).toBeFalsy();
    });

    it('rejects negative minimumScale', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: -1, maximumScale: 1000 });
      expect(component.entityForm.get('minimumScale')?.errors?.['scaleInteger']).toBeTruthy();
      expect(component.entityForm.valid).toBeFalsy();
    });

    it('rejects decimal minimumScale', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 1.5, maximumScale: 1000 });
      expect(component.entityForm.get('minimumScale')?.errors?.['scaleInteger']).toBeTruthy();
      expect(component.entityForm.valid).toBeFalsy();
    });

    it('invalid persisted minimumScale makes form invalid on load', () => {
      component.entityToEdit = Object.assign(new CartographyProjection(), {
        name: 'layer',
        layers: ['x'],
        serviceId: 1,
        minimumScale: -5,
        maximumScale: null
      });
      component.postFetchData();
      expect(component.entityForm.get('minimumScale')?.errors?.['scaleInteger']).toBeTruthy();
      expect(component.canSave()).toBeFalsy();
    });

    it('createObject passes through 0 and null scale values', () => {
      patchValidBasics();
      component.entityForm.patchValue({
        minimumScale: 0,
        maximumScale: null
      });
      const created = component.createObject(1);
      expect(created.minimumScale).toBe(0);
      expect(created.maximumScale).toBeNull();
    });

    it('clears scaleRange when min is corrected', () => {
      patchValidBasics();
      component.entityForm.patchValue({ minimumScale: 200, maximumScale: 150 });
      expect(component.entityForm.errors?.['scaleRange']).toBeTruthy();
      component.entityForm.patchValue({ minimumScale: 100 });
      expect(component.entityForm.errors?.['scaleRange']).toBeFalsy();
      expect(component.entityForm.valid).toBeTruthy();
    });
  });

  describe('grid type classification for wrapper migration', () => {
    it('should have simple editable relation grids (territoryAvailabilitiesTable)', () => {
      expect(component['territoryAvailabilitiesTable']).toBeDefined();
      expect(component['territoryAvailabilitiesTable'].hasPickerAdd()).toBe(true);
      expect(component['territoryAvailabilitiesTable'].hasRelationsUpdater()).toBe(true);
      expect(component['territoryAvailabilitiesTable'].hasStatusColumn()).toBe(true);
      expect(component['territoryAvailabilitiesTable'].hasTemplateDialogs()).toBe(false);
    });

    it('should have simple editable relation grids (cartographyPermissionsTable)', () => {
      expect(component['cartographyPermissionsTable']).toBeDefined();
      expect(component['cartographyPermissionsTable'].hasPickerAdd()).toBe(true);
      expect(component['cartographyPermissionsTable'].hasRelationsUpdater()).toBe(true);
      expect(component['cartographyPermissionsTable'].hasStatusColumn()).toBe(true);
      expect(component['cartographyPermissionsTable'].hasTemplateDialogs()).toBe(false);
    });

    it('should have read-only grid (treesNodesTable)', () => {
      const table = component['treesNodesTable'];
      expect(table).toBeDefined();
      expect(table.hasPickerAdd()).toBe(false);
      expect(table.hasRelationsUpdater()).toBe(false);
      expect(table.hasStatusColumn()).toBe(false);
      expect(table.hasTemplateDialogs()).toBe(false);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.relationsColumnsDefs.some((col: { checkboxSelection?: boolean }) => col.checkboxSelection))
        .toBe(true);
    });

    it('parametersTable should have template-dialog, updater, and status capabilities', () => {
      const table = component['parametersTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.hasPickerAdd()).toBe(false);
      expect(table.relationsColumnsDefs.some((col: { field?: string }) => col.field === 'type')).toBe(false);
      expect(table.relationsColumnsDefs.some((col: { field?: string }) =>
        col.field === 'fractionDigits' || col.field === 'padFractionDigits' || col.field === 'dateStyle'
      )).toBe(false);
      expect(table.relationsColumnsDefs.some((col: { colId?: string }) => col.colId === 'formatOptions')).toBe(true);
      const formatColumn = table.relationsColumnsDefs.find((col: { field?: string }) => col.field === 'format') as {
        editable?: boolean;
        cellEditor?: string;
      };
      expect(formatColumn?.editable).toBe(true);
      expect(formatColumn?.cellEditor).toBe('agSelectCellEditor');
      const labelColumn = table.relationsColumnsDefs.find((col: { field?: string }) => col.field === 'value') as {
        headerValueGetter?: () => string;
      };
      expect(labelColumn.headerValueGetter?.()).toBe(
        `${component['utils'].getTranslate('entity.cartography.parameters.value')} (${component.defaultLang})`
      );
    });

    it('opens parameter label translations from the Etiqueta cell icon', async () => {
      const valueColumn = component['parametersTable'].relationsColumnsDefs.find(
        (col: { field?: string }) => col.field === 'value'
      ) as { cellRenderer?: (params: { value?: string; data?: { id?: number; value?: string } }) => HTMLElement };
      const translate = jest.spyOn(component as unknown as {
        translateElement: (...args: unknown[]) => Promise<void>;
      }, 'translateElement').mockResolvedValue(undefined);
      const cell = valueColumn.cellRenderer?.({ value: 'Kind', data: { id: 9102, value: 'Kind' } });
      const savedButton = cell?.querySelector('button');
      expect(savedButton?.disabled).toBe(false);
      expect(savedButton?.classList.contains('iconTranslateDisabled')).toBe(false);
      savedButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(translate).toHaveBeenCalledWith('CartographyParameter', 'value', 9102, 'Kind', 250);

      translate.mockClear();
      const unsaved = valueColumn.cellRenderer?.({ value: 'Draft', data: { value: 'Draft' } });
      const unsavedButton = unsaved?.querySelector('button');
      expect(unsavedButton?.disabled).toBe(true);
      expect(unsavedButton?.classList.contains('iconTranslateDisabled')).toBe(true);
      unsavedButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(translate).not.toHaveBeenCalled();
    });

    it('edits format settings in the options cell', () => {
      const column = component['parametersTable'].relationsColumnsDefs.find(
        (col: { colId?: string }) => col.colId === 'formatOptions'
      ) as {
        editable?: boolean;
        onCellDoubleClicked?: unknown;
        cellRenderer?: (params: {
          data?: {
            format?: string | null;
            fractionDigits?: number | null;
            padFractionDigits?: boolean;
            dateStyle?: string | null;
            maxWidth?: number | null;
            maxHeight?: number | null;
            status?: string;
            newItem?: boolean;
          };
          api?: { refreshCells: () => void };
        }) => HTMLElement;
      };
      const locale = localStorage.getItem('lang') || 'en';
      const refreshCells = jest.fn();
      const gridModified = jest.fn();
      component['parametersGrid'] = {
        dataGrid: {
          someStatusHasChanged: false,
          changeCounter: 0,
          previousChangeCounter: 0,
          gridModified: { emit: gridModified }
        }
      } as unknown as LayersFormComponent['parametersGrid'];
      expect(column.editable).toBe(false);
      expect(column.onCellDoubleClicked).toBeUndefined();

      const numberRow = {
        format: 'N',
        fractionDigits: 2,
        padFractionDigits: false,
        status: 'statusOK',
        newItem: false
      };
      const numberCell = column.cellRenderer?.({ data: numberRow, api: { refreshCells } });
      const digits = numberCell?.querySelector('input[type="number"]') as HTMLInputElement;
      const pad = numberCell?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(digits.value).toBe('2');
      expect(digits.max).toBe('99');
      expect(pad.checked).toBe(false);
      expect(numberCell?.querySelector('.sitmun-format-preview')?.textContent)
        .toBe(previewFeatureInfoFormat('N', 2, false, null, locale));
      expect(numberCell?.textContent).toContain('entity.cartography.parameters.padFractionDigits');

      digits.value = '0';
      digits.dispatchEvent(new Event('input'));
      expect(numberRow.fractionDigits).toBe(0);
      expect(numberRow.status).toBe('pendingModify');
      expect(component['parametersGrid']?.dataGrid?.someStatusHasChanged).toBe(true);
      expect(gridModified).toHaveBeenCalledWith(true);
      expect(numberCell?.querySelector('.sitmun-format-preview')?.textContent)
        .toBe(previewFeatureInfoFormat('N', 0, false, null, locale));

      digits.value = '';
      digits.dispatchEvent(new Event('input'));
      expect(numberRow.fractionDigits).toBeNull();

      digits.value = '1.5';
      digits.dispatchEvent(new Event('input'));
      expect(numberRow.fractionDigits).toBeNull();

      pad.checked = true;
      pad.dispatchEvent(new Event('change'));
      expect(numberRow.padFractionDigits).toBe(true);
      expect(refreshCells).toHaveBeenCalled();

      const draft = {
        format: 'P',
        fractionDigits: 1,
        padFractionDigits: false,
        status: 'pendingCreation',
        newItem: true
      };
      const percentCell = column.cellRenderer?.({ data: draft, api: { refreshCells } });
      const percentPad = percentCell?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      percentPad.checked = true;
      percentPad.dispatchEvent(new Event('change'));
      expect(draft.padFractionDigits).toBe(true);
      expect(draft.status).toBe('pendingCreation');
      expect(percentCell?.querySelector('.sitmun-format-preview')?.textContent)
        .toBe(previewFeatureInfoFormat('P', 1, true, null, locale));

      expect(column.cellRenderer?.({ data: { format: 'T' } }).querySelector('input, select')).toBeNull();
      expect(column.cellRenderer?.({ data: { format: 'U' } }).querySelector('input, select')).toBeNull();
      expect(column.cellRenderer?.({ data: { format: 'AUTO' } }).querySelector('input, select')).toBeNull();

      const imageRow = {
        format: 'I',
        maxWidth: 240 as number | null,
        maxHeight: 160 as number | null,
        status: 'statusOK',
        newItem: false
      };
      const imageCell = column.cellRenderer?.({ data: imageRow, api: { refreshCells } });
      const width = imageCell?.querySelector(
        'input[aria-label="entity.cartography.parameters.maxWidth"]'
      ) as HTMLInputElement;
      const height = imageCell?.querySelector(
        'input[aria-label="entity.cartography.parameters.maxHeight"]'
      ) as HTMLInputElement;
      expect(width.value).toBe('240');
      expect(height.value).toBe('160');
      expect(width.closest('label')?.textContent).toContain('entity.cartography.parameters.maxWidth');
      expect(height.closest('label')?.textContent).toContain('entity.cartography.parameters.maxHeight');
      expect(width.placeholder).toBe('auto');
      expect(height.placeholder).toBe('auto');
      width.value = '200';
      width.dispatchEvent(new Event('input'));
      expect(imageRow.maxWidth).toBe(200);
      expect(imageRow.status).toBe('pendingModify');
      width.value = '';
      width.dispatchEvent(new Event('input'));
      expect(imageRow.maxWidth).toBeNull();
      const clearedWidth = persistedCartographyParameter(imageRow as unknown as CartographyParameter);
      expect(clearedWidth.options).toEqual({maxHeight: 160});
      expect(clearedWidth.maxWidth).toBeUndefined();
      width.value = '0';
      width.dispatchEvent(new Event('input'));
      expect(imageRow.maxWidth).toBeNull();
      height.value = '';
      height.dispatchEvent(new Event('input'));
      expect(imageRow.maxHeight).toBeNull();
      const saved = persistedCartographyParameter(imageRow as unknown as CartographyParameter);
      expect(saved.options).toBeNull();
      expect(saved.maxWidth).toBeUndefined();
      expect(saved.maxHeight).toBeUndefined();
      expect(column.cellRenderer?.({ data: { format: null } }).querySelector('input, select')).toBeNull();

      const dateRow = { format: 'F', dateStyle: null as string | null, status: 'statusOK', newItem: false };
      const dateCell = column.cellRenderer?.({ data: dateRow, api: { refreshCells } });
      const select = dateCell?.querySelector('select') as HTMLSelectElement;
      expect(Array.from(select.options).map((option) => option.value)).toEqual(['datetime', 'date']);
      expect(select.value).toBe('datetime');
      select.value = 'date';
      select.dispatchEvent(new Event('change'));
      expect(dateRow.dateStyle).toBe('date');
      expect(dateCell?.querySelector('.sitmun-format-preview')?.textContent)
        .toBe(previewFeatureInfoFormat('F', null, false, 'date', locale));
      select.value = 'datetime';
      select.dispatchEvent(new Event('change'));
      expect(dateRow.dateStyle).toBeNull();
    });

    it('sets parameter type to INFO when the add dialog opens', () => {
      const dialog = component['parametersTable'].templateDialog('newParameterDialog');
      dialog.form.patchValue({ type: 'OTHER' });
      dialog.preOpenFn(dialog.form);
      expect(dialog.form.get('type')?.value).toBe('INFO');
      expect(dialog.form.get('maxWidth')?.value).toBeNull();
      expect(dialog.form.get('maxHeight')?.value).toBeNull();
    });

    it('territorialFiltersTable should have template-dialog, updater, and status capabilities', () => {
      const table = component['territorialFiltersTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.hasPickerAdd()).toBe(false);
    });

    it('stylesTable should have template-dialog, updater, and status capabilities', () => {
      const table = component['stylesTable'];
      expect(table.hasTemplateDialogs()).toBe(true);
      expect(table.hasRelationsUpdater()).toBe(true);
      expect(table.hasStatusColumn()).toBe(true);
      expect(table.supportsDuplicate()).toBe(false);
      expect(table.hasPickerAdd()).toBe(false);
    });
  });

  describe('template markup', () => {
    it('uses the service-form button for loading feature properties', () => {
      expect(layersFormTemplate).toContain('id="featureInfoSeedButton"');
      expect(layersFormTemplate).toContain('mat-raised-button');
      expect(layersFormTemplate).toContain('color="primary"');
      expect(layersFormTemplate).toContain('(click)="seedFeatureInfoFields()"');
    });

    it('does not use the undefined and-gap utility class', () => {
      expect(layersFormTemplate).not.toContain('and-gap');
      expect(layersFormTemplate).toContain('add-gap');
    });

    it('does not show the invariant parameter type in the add dialog', () => {
      const parameterDialog = layersFormTemplate.match(/#newParameterDialog[\s\S]*?<\/ng-template>/)?.[0] ?? '';
      expect(parameterDialog).not.toContain('formControlName="type"');
      expect(parameterDialog).not.toContain('cartographyParameter.type');
      expect(parameterDialog).toContain(
        "{{ 'entity.cartography.parameters.value' | translate }} ({{ defaultLang }})"
      );
      expect(parameterDialog).toContain('[class.iconTranslateDisabled]="!canTranslateParameterLabel()"');
      expect(parameterDialog).toContain('parameterFormatShowsImageSize()');
      expect(parameterDialog.match(/formControlName="maxWidth"/g)).toHaveLength(1);
      expect(parameterDialog.match(/formControlName="maxHeight"/g)).toHaveLength(1);
      expect(parameterDialog).toContain('placeholder="auto"');
      expect(layersFormTemplate).not.toContain('translateSelectedParameter');
    });

    it('uses primary slide toggles in modal dialogs instead of checkboxes', () => {
      const styleDialog = layersFormTemplate.match(/#newStyleDialog[\s\S]*?<\/ng-template>/)?.[0] ?? '';
      const filterDialog = layersFormTemplate.match(/#newTerritorialFilterDialog[\s\S]*?<\/ng-template>/)?.[0] ?? '';

      expect(styleDialog).toContain('mat-slide-toggle color="primary" formControlName="defaultStyle"');
      expect(styleDialog).not.toContain('mat-checkbox formControlName="defaultStyle"');
      expect(filterDialog).toContain('mat-slide-toggle color="primary" formControlName="required"');
      expect(filterDialog).not.toContain('mat-checkbox formControlName="required"');
    });

    it('scopes the Details entity form and keeps Territories on app-relation-grid', () => {
      const detailsTab = layersFormTemplate.match(
        /label="\{\{ 'common\.form\.details' \| translate \}\}"[\s\S]*?(?=<mat-tab label="\{\{ 'entity\.cartography\.territories)/,
      )?.[0] ?? '';
      const territoriesTab = layersFormTemplate.match(
        /entity\.cartography\.territories\.header[\s\S]*?<\/mat-tab>/,
      )?.[0] ?? '';

      expect(detailsTab).toContain('<form');
      expect(detailsTab).toContain('sitmun-cartography-form-entity');
      expect(detailsTab).toContain('related-entity-open-link');
      expect(detailsTab).toContain("['/service', serviceId, 'serviceForm']");
      expect(territoriesTab).toContain('app-relation-grid');
      expect(territoriesTab).toContain('matTabContent');
      expect(territoriesTab).not.toContain('sitmun-cartography-form-entity');
    });

    it('uses feature-type wording when the linked service is WFS', () => {
      const flags = TestBed.inject(FeatureFlagService);
      expect(flags.isFeatureEnabled('LAYERS_LEGEND_TAB_FEATURE')).toBe(true);
      expect(flags.isFeatureEnabled('LAYERS_CARTOGRAPHY_STYLES_TAB_FEATURE')).toBe(true);
      expect(flags.isFeatureEnabled('LAYERS_FILTERS_TAB_FEATURE')).toBe(true);
      expect(flags.isFeatureEnabled('LAYERS_FEATURE_INFORMATION_TAB_FEATURE')).toBe(true);

      component.services = [{ id: 7, type: 'WFS' }];
      component.entityForm.patchValue({ serviceId: 7 });

      expect(component.cartographyCopyKey('entity.cartography.styles.useAllStyles'))
        .toBe('entity.cartography.styles.useAllStyles.wfs');
      expect(component.cartographyCopyKey('entity.cartography.filters.applyFilterToGetMap'))
        .toBe('entity.cartography.filters.applyFilterToGetMap.wfs');
      expect(component.cartographyCopyKey('entity.cartography.featureInformation.layerAll'))
        .toBe('entity.cartography.featureInformation.layerAll.wfs');
      expect(component.cartographyCopyKey('entity.cartography.legend.sitnaControlCapabilities'))
        .toBe('entity.cartography.legend.sitnaControlCapabilities.wfs');
      expect(layersFormTemplate).toContain("cartographyCopyKey('entity.cartography.styles.useAllStyles')");
      expect(layersFormTemplate).toContain("cartographyCopyKey('entity.cartography.filters.applyFilterToGetMap')");
      expect(layersFormTemplate).toContain("cartographyCopyKey('entity.cartography.featureInformation.layerAll')");
      expect(layersFormTemplate).toContain("cartographyCopyKey('entity.cartography.legend.sitnaControlCapabilities')");
    });

    it('keeps layer wording when the linked service is WMS', () => {
      component.services = [{ id: 7, type: 'WMS' }];
      component.entityForm.patchValue({ serviceId: 7 });

      expect(component.cartographyCopyKey('entity.cartography.styles.useAllStyles'))
        .toBe('entity.cartography.styles.useAllStyles');
    });

    it('wraps Permissions and Trees relation grids in matTabContent', () => {
      const permissionsTab = layersFormTemplate.match(
        /entity\.cartography\.permissions\.header[\s\S]*?<\/mat-tab>/,
      )?.[0] ?? '';
      const treesTab = layersFormTemplate.match(
        /entity\.cartography\.trees\.header[\s\S]*?<\/mat-tab>/,
      )?.[0] ?? '';

      expect(permissionsTab).toContain('app-relation-grid');
      expect(permissionsTab).toContain('matTabContent');
      expect(treesTab).toContain('app-relation-grid');
      expect(treesTab).toContain('matTabContent');
    });
  });

  describe('grid boolean column sizing', () => {
    it('constrains the filters required column width', () => {
      const requiredColumn = component['territorialFiltersTable'].relationsColumnsDefs
        .find(col => col.field === 'required');

      expect(requiredColumn.flex).toBe(0);
      expect(requiredColumn.minWidth).toBe(100);
      expect(requiredColumn.maxWidth).toBe(120);
    });

    it('constrains the styles defaultStyle column width', () => {
      const defaultStyleColumn = component['stylesTable'].relationsColumnsDefs
        .find(col => col.field === 'defaultStyle');

      expect(defaultStyleColumn.flex).toBe(0);
      expect(defaultStyleColumn.minWidth).toBe(100);
      expect(defaultStyleColumn.maxWidth).toBe(120);
    });

    it('loads WMS properties through DescribeLayer and explains when that fails', async () => {
      const schema = {
        'xsd:schema': {
          'xsd:complexType': {
            name: 'roadsType',
            'xsd:complexContent': {
              'xsd:extension': {
                base: 'gml:AbstractFeatureType',
                'xsd:sequence': {
                  'xsd:element': { name: 'season', type: 'xsd:string' }
                }
              }
            }
          }
        }
      };
      const describeLayer = {
        DescribeLayerResponse: {
          LayerDescription: {
            name: 'roads',
            owsURL: 'https://example.test/wfs',
            owsType: 'WFS',
            Query: { typeName: 'app:roads' }
          }
        }
      };
      const dialogRef = {
        componentInstance: { title: '', message: '' },
        afterClosed: () => of({ event: 'Accept' })
      };
      jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRef as never);
      const addItems = jest.fn();
      component['parametersGrid'] = {
        dataGrid: { gridApi: {}, getAllCurrentData: () => [], addItems }
      } as never;
      component.services = [{ id: 7, type: 'WMS', serviceURL: 'https://example.test/wms' }];
      component.entityForm.patchValue({ serviceId: 7, joinedLayers: 'roads' });
      const getInfo = jest.spyOn(getInfoService, 'getInfo')
        .mockReturnValueOnce(throwError(() => new HttpErrorResponse({
          status: 400,
          error: { success: false, reason: 'Unmanaged XML response', asJson: describeLayer }
        })))
        .mockReturnValueOnce(of({ success: true, asJson: schema }));

      component.seedFeatureInfoFields();

      expect(dialogRef.componentInstance.title).toBe(component['utils'].getTranslate('common.caution'));
      expect(dialogRef.componentInstance.message).toBe(
        component['utils'].getTranslate('entity.cartography.parameters.seedConfirm')
      );
      await flushSeed();
      const urls = getInfo.mock.calls.map((call) => decodeURIComponent(String(call[0])));
      expect(urls[0]).toContain('request=DescribeLayer');
      expect(urls[0]).toContain('layers=roads');
      expect(urls[1]).toContain('request=DescribeFeatureType');
      expect(addItems).toHaveBeenCalledWith([
        expect.objectContaining({ name: 'season', value: 'season', type: 'INFO' })
      ]);

      getInfo.mockReset();
      getInfo.mockReturnValue(throwError(() => new HttpErrorResponse({
        status: 400,
        error: { asJson: { 'ows:ExceptionReport': {} } }
      })));
      component.seedFeatureInfoFields();
      await flushSeed();
      expect(component.featureInfoSeedMessage).toBe(
        component['translateService'].instant('entity.cartography.parameters.seedDescribeLayerUnavailable')
      );

      getInfo.mockReset();
      getInfo
        .mockReturnValueOnce(of({ success: true, asJson: describeLayer }))
        .mockReturnValueOnce(throwError(() => new HttpErrorResponse({
          status: 400,
          error: { reason: 'Unmanaged XML response' }
        })));
      component.seedFeatureInfoFields();
      await flushSeed();
      expect(component.featureInfoSeedMessage).toBe(
        component['translateService'].instant('entity.cartography.parameters.seedFeatureTypeFailed')
      );

      async function flushSeed(): Promise<void> {
        for (let attempt = 0; attempt < 20; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    });

    it('keeps style legend URL editable with the editable external URL renderer mode', () => {
      const urlColumn = component['stylesTable'].relationsColumnsDefs
        .find(col => col.field === 'legendURL.onlineResource');

      expect(urlColumn.editable).toBe(true);
      expect(urlColumn.cellRenderer).toBe('externalUrlRenderer');
      expect(urlColumn.cellRendererParams).toEqual({ editable: true });
    });
  });

});
