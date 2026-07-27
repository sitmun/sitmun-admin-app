
import { readFileSync } from 'fs';
import { join } from 'path';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';

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
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';
import {constants} from '@environments/constants';

import { LayersFormComponent } from './layers-form.component';

const layersFormTemplate = readFileSync(join(__dirname, 'layers-form.component.html'), 'utf8');

describe('LayersFormComponent', () => {
  let component: LayersFormComponent;
  let fixture: ComponentFixture<LayersFormComponent>;
  let cartographyService: CartographyService;
  let serviceService: ServiceService;
  let connectionService: ConnectionService;
  let codeListService: CodeListService;
  let cartographyGroupService: CartographyGroupService;
  let territoryTypeService: TerritoryTypeService;
  let treeNodeService: TreeNodeService;
  let territoryService: TerritoryService;
  let getInfoService: GetInfoService;
  let cartographyAvailabilityService: CartographyAvailabilityService;
  let cartographyParameterService: CartographyParameterService;
  let cartographySpatialSelectionParameterService: CartographySpatialSelectionParameterService;
  let cartographyFilterService: CartographyFilterService;
  let cartographyStyleService: CartographyStyleService;
  let translationService: TranslationService;
  let resourceService: ResourceService;
  let externalService: ExternalService;

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
      imports: [FormsModule, ReactiveFormsModule, RouterModule.forRoot([], {}), SitmunFrontendGuiModule,
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
    serviceService = TestBed.inject(ServiceService);
    connectionService = TestBed.inject(ConnectionService);
    codeListService = TestBed.inject(CodeListService);
    cartographyGroupService = TestBed.inject(CartographyGroupService);
    territoryTypeService = TestBed.inject(TerritoryTypeService);
    treeNodeService = TestBed.inject(TreeNodeService);
    territoryService = TestBed.inject(TerritoryService);
    getInfoService = TestBed.inject(GetInfoService);
    cartographyAvailabilityService = TestBed.inject(CartographyAvailabilityService);
    cartographyParameterService = TestBed.inject(CartographyParameterService);
    cartographySpatialSelectionParameterService = TestBed.inject(CartographySpatialSelectionParameterService);
    cartographyFilterService = TestBed.inject(CartographyFilterService);
    cartographyStyleService = TestBed.inject(CartographyStyleService);
    translationService = TestBed.inject(TranslationService);
    resourceService = TestBed.inject(ResourceService);
    externalService = TestBed.inject(ExternalService);
    // Initialize form before detectChanges to prevent afterFetch from failing
    component.entityToEdit = component.empty();
    component.postFetchData();
    fixture.detectChanges();
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate cartographyService', () => {
    expect(cartographyService).toBeTruthy();
  });

  it('should instantiate serviceService', () => {
    expect(serviceService).toBeTruthy();
  });

  it('should instantiate connectionService', () => {
    expect(connectionService).toBeTruthy();
  });

  it('should instantiate codeListService', () => {
    expect(codeListService).toBeTruthy();
  });

  it('should instantiate cartographyGroupService', () => {
    expect(cartographyGroupService).toBeTruthy();
  });

  it('should instantiate territoryTypeService', () => {
    expect(territoryTypeService).toBeTruthy();
  });

  it('should instantiate treeNodeService', () => {
    expect(treeNodeService).toBeTruthy();
  });

  it('should instantiate territoryService', () => {
    expect(territoryService).toBeTruthy();
  });

  it('should instantiate getInfoService', () => {
    expect(getInfoService).toBeTruthy();
  });

  it('should instantiate cartographyAvailabilityService', () => {
    expect(cartographyAvailabilityService).toBeTruthy();
  });

  it('should instantiate cartographyParameterService', () => {
    expect(cartographyParameterService).toBeTruthy();
  });

  it('should instantiate cartographySpatialSelectionParameterService', () => {
    expect(cartographySpatialSelectionParameterService).toBeTruthy();
  });

  it('should instantiate cartographyFilterService', () => {
    expect(cartographyFilterService).toBeTruthy();
  });

  it('should instantiate cartographyStyleService', () => {
    expect(cartographyStyleService).toBeTruthy();
  });

  it('should instantiate translationService', () => {
    expect(translationService).toBeTruthy();
  });

  it('should instantiate resourceService', () => {
    expect(resourceService).toBeTruthy();
  });

  it('should instantiate externalService', () => {
    expect(externalService).toBeTruthy();
  });

  it('form invalid when empty', () => {
    // Initialize form if not already initialized
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form invalid when mid-empty', () => {
    // Initialize form if not already initialized
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
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form valid', () => {
    // Initialize form if not already initialized
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
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Layer form fields', () => {
    // Initialize form if not already initialized
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('serviceId')).toBeTruthy();
    expect(component.entityForm.get('joinedLayers')).toBeTruthy();
    expect(component.entityForm.get('minimumScale')).toBeTruthy();
    expect(component.entityForm.get('maximumScale')).toBeTruthy();
    expect(component.entityForm.get('order')).toBeTruthy();
    expect(component.entityForm.get('transparency')).toBeTruthy();
    expect(component.entityForm.get('metadataURL')).toBeTruthy();
    expect(component.entityForm.get('legendType')).toBeTruthy();
    expect(component.entityForm.get('legendURL')).toBeTruthy();
    expect(component.entityForm.get('source')).toBeTruthy();
    expect(component.entityForm.get('description')).toBeTruthy();
    expect(component.entityForm.get('datasetURL')).toBeTruthy();
    expect(component.entityForm.get('applyFilterToGetMap')).toBeTruthy();
    expect(component.entityForm.get('applyFilterToGetFeatureInfo')).toBeTruthy();
    expect(component.entityForm.get('applyFilterToSpatialSelection')).toBeTruthy();
    expect(component.entityForm.get('queryableFeatureEnabled')).toBeTruthy();
    expect(component.entityForm.get('queryableFeatureAvailable')).toBeTruthy();
    expect(component.entityForm.get('joinedQueryableLayers')).toBeTruthy();
    expect(component.entityForm.get('thematic')).toBeTruthy();
    expect(component.entityForm.get('availableForClients')).toBeTruthy();
    expect(component.entityForm.get('selectableFeatureEnabled')).toBeTruthy();
    expect(component.entityForm.get('spatialSelectionServiceId')).toBeTruthy();
    expect(component.entityForm.get('joinedSelectableLayers')).toBeTruthy();
    expect(component.entityForm.get('useAllStyles')).toBeTruthy();
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
    it('does not use the undefined and-gap utility class', () => {
      expect(layersFormTemplate).not.toContain('and-gap');
      expect(layersFormTemplate).toContain('add-gap');
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
      expect(territoriesTab).not.toContain('sitmun-cartography-form-entity');
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

    it('keeps style legend URL editable with the editable external URL renderer mode', () => {
      const urlColumn = component['stylesTable'].relationsColumnsDefs
        .find(col => col.field === 'legendURL.onlineResource');

      expect(urlColumn.editable).toBe(true);
      expect(urlColumn.cellRenderer).toBe('externalUrlRenderer');
      expect(urlColumn.cellRendererParams).toEqual({ editable: true });
    });
  });

});
