import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { of } from 'rxjs';

import { Service, TaskGroup, TaskType } from '@app/domain';
import { LanguageService } from '@app/domain/translation/services/language.service';
import { magic } from '@environments/constants';

import { MapImageLayerCatalogService } from './map-image-layer-catalog.service';
import { TaskMapImageFormComponent } from './task-map-image-form.component';

describe('TaskMapImageFormComponent', () => {
  let component: TaskMapImageFormComponent;
  let translationService: Record<string, jest.Mock>;
  let codeListService: Record<string, jest.Mock>;
  let loggerService: Record<string, jest.Mock>;
  let taskService: Record<string, jest.Mock>;
  let taskTypeService: Record<string, jest.Mock>;
  let taskGroupService: Record<string, jest.Mock>;
  let roleService: Record<string, jest.Mock>;
  let territoryService: Record<string, jest.Mock>;
  let taskAvailabilityService: Record<string, jest.Mock>;
  let serviceService: Record<string, jest.Mock>;
  let cartographyService: Record<string, jest.Mock>;

  const createSpyObj = (methods: string[]) => {
    return methods.reduce((acc, methodName) => {
      acc[methodName] = jest.fn();
      return acc;
    }, {} as Record<string, jest.Mock>);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ChangeDetectorRef, useValue: createSpyObj(['markForCheck']) },
        {
          provide: LanguageService,
          useValue: {
            applyLanguagesToUse: (languages: unknown[]) => languages,
            fetchAllItems: () => of([]),
            languagesToUse$: of([]),
          },
        },
      ],
    });

    const translateService = createSpyObj(['instant', 'get']);
    translateService.instant.mockImplementation((key: string) => key);
    translationService = createSpyObj(['getAllByNameAndEntity', 'getAllByName']);
    codeListService = createSpyObj(['fetchAllItems']);
    codeListService.fetchAllItems.mockReturnValue(of([]));

    const utilsService = createSpyObj([
      'navigateBack',
      'getSelCheckboxColumnDef',
      'getRouterLinkColumnDef',
      'getNonEditableColumnDef',
      'getStatusColumnDef',
      'getNonEditableDateColumnDef',
      'getEditableColumnDef',
      'getNonEditableColumnWithCodeListDef',
      'getBooleanColumnDef',
      'addConditionToColumnDef',
    ]);
    utilsService.getSelCheckboxColumnDef.mockReturnValue({});
    utilsService.getRouterLinkColumnDef.mockReturnValue({});
    utilsService.getNonEditableColumnDef.mockReturnValue({});
    utilsService.getStatusColumnDef.mockReturnValue({ field: 'status' });
    utilsService.getNonEditableDateColumnDef.mockReturnValue({});
    utilsService.getEditableColumnDef.mockReturnValue({});
    utilsService.getNonEditableColumnWithCodeListDef.mockReturnValue({});
    utilsService.getBooleanColumnDef.mockReturnValue({});
    utilsService.addConditionToColumnDef.mockImplementation((columnDef: unknown) => columnDef);

    loggerService = createSpyObj(['error', 'warn', 'debug', 'info']);
    taskService = createSpyObj(['create', 'update', 'fetchProjectionById']);
    taskTypeService = createSpyObj(['fetchAllItems']);
    taskGroupService = createSpyObj(['fetchAllItems', 'createProxy']);
    roleService = createSpyObj(['fetchAllItems']);
    territoryService = createSpyObj(['fetchAllProjectionItems', 'createProxy']);
    taskAvailabilityService = createSpyObj(['create', 'delete', 'createProxy']);
    serviceService = createSpyObj(['fetchWmsItems']);
    cartographyService = createSpyObj(['fetchProjectionItemsByService']);
    cartographyService.fetchProjectionItemsByService.mockReturnValue(of([]));

    component = TestBed.runInInjectionContext(() => new TaskMapImageFormComponent(
      {} as any,
      translateService as any,
      translationService as any,
      codeListService as any,
      loggerService as any,
      createSpyObj(['handleError']) as any,
      { params: new FormControl({}) } as any,
      createSpyObj(['navigate']) as any,
      createSpyObj(['show', 'hide']) as any,
      createSpyObj(['enable', 'disable']) as any,
      taskService as any,
      taskTypeService as any,
      taskGroupService as any,
      roleService as any,
      territoryService as any,
      taskAvailabilityService as any,
      cartographyService as any,
      serviceService as any,
      new MapImageLayerCatalogService(),
      utilsService as any,
    ));
  });

  it('preFetchData loads WMS services for map-image task', async () => {
    taskTypeService.fetchAllItems.mockReturnValue(of([{ id: magic.taskMapImageTypeId } as TaskType]));
    taskGroupService.fetchAllItems.mockReturnValue(of([{ id: 2, name: 'Tasks' } as TaskGroup]));
    serviceService.fetchWmsItems.mockReturnValue(of([
      { id: 1, name: 'WMS A', type: 'WMS' } as Service,
      { id: 2, name: 'WMS B', type: 'WMS' } as Service,
    ]));

    await component.preFetchData();

    expect((component as any).services).toEqual([
      { id: 1, name: 'WMS A', type: 'WMS' },
      { id: 2, name: 'WMS B', type: 'WMS' },
    ]);
    expect(cartographyService.fetchProjectionItemsByService).not.toHaveBeenCalled();
    expect((component as any).availableLayerOptions).toEqual([]);
  });

  it('preFetchData warns when backend task type is missing', async () => {
    taskTypeService.fetchAllItems.mockReturnValue(of([{ id: 99 } as TaskType]));
    taskGroupService.fetchAllItems.mockReturnValue(of([]));
    serviceService.fetchWmsItems.mockReturnValue(of([]));

    await component.preFetchData();

    expect(loggerService.warn).toHaveBeenCalledWith(`Map image task type ${magic.taskMapImageTypeId} not found yet in backend catalog`);
  });

  it('starts new task with empty srs field', () => {
    component.entityToEdit = component.empty();

    component.postFetchData();

    expect(component.entityForm.get('srs')?.value).toBe('');
    expect(component.entityForm.get('bboxMarginPercent')?.value).toBe(0);
  });

  it('generates feature bbox parameters when creating a new task', () => {
    component.entityToEdit = component.empty();

    component.postFetchData();

    expect(component.entityToEdit.properties?.['parameters']).toEqual([
      {
        name: 'featureBboxMinX',
        label: 'featureBboxMinX',
        type: 'template',
        value: 'featureBboxMinX',
      },
      {
        name: 'featureBboxMinY',
        label: 'featureBboxMinY',
        type: 'template',
        value: 'featureBboxMinY',
      },
      {
        name: 'featureBboxMaxX',
        label: 'featureBboxMaxX',
        type: 'template',
        value: 'featureBboxMaxX',
      },
      {
        name: 'featureBboxMaxY',
        label: 'featureBboxMaxY',
        type: 'template',
        value: 'featureBboxMaxY',
      },
      {
        name: '__featureBboxSize',
        label: '__featureBboxSize',
        type: 'template',
        value: '__featureBboxSize',
      },
    ]);
  });

  it('does not generate feature bbox parameters while editing an existing task', () => {
    component.entityID = 123;
    component.entityToEdit = component.empty();

    component.postFetchData();

    expect(component.entityToEdit.properties?.['parameters']).toBeUndefined();
  });

  it('exposes an editable parameters table', () => {
    const table = component['parametersTable'];

    expect(table.hasTemplateDialogs()).toBe(true);
    expect(table.hasRelationsUpdater()).toBe(true);
    expect(table.hasStatusColumn()).toBe(true);
    expect(table.supportsDuplicate()).toBe(true);
    expect(table.hasPickerAdd()).toBe(false);
  });

  it('filters available layers by service and text', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        format: 'png',
        width: 1024,
        height: 768,
        srs: 'EPSG:25831',
        bboxMarginPercent: 5,
        mapSources: [],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
      {
        serviceId: 10,
        serviceName: 'Urbanism WMS',
        layerIds: ['ur001_planejament'],
        layerIdLabel: 'ur001_planejament',
        layerName: 'Planejament',
      },
    ];

    component.postFetchData();

    expect((component as any).filteredLayerOptions).toEqual([]);

    (component as any).onServiceFilterChange(9);
    (component as any).onLayerSearchTextChange('estades');

    expect((component as any).filteredLayerOptions).toEqual([
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
    ]);

    (component as any).onLayerSearchTextChange('planejament');
    expect((component as any).filteredLayerOptions).toEqual([]);

    (component as any).onServiceFilterChange(null);
    (component as any).onLayerSearchTextChange('ur001');
    expect((component as any).filteredLayerOptions).toEqual([
      {
        serviceId: 10,
        serviceName: 'Urbanism WMS',
        layerIds: ['ur001_planejament'],
        layerIdLabel: 'ur001_planejament',
        layerName: 'Planejament',
      },
    ]);
  });

  it('clears service and text filters at once', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
    ];

    component.postFetchData();
    (component as any).onServiceFilterChange(9);
    (component as any).onLayerSearchTextChange('estades');

    (component as any).clearLayerFilters();

    expect((component as any).selectedServiceFilter).toBeNull();
    expect((component as any).layerSearchText).toBe('');
    expect((component as any).filteredLayerOptions).toEqual([]);
  });

  it('hides already selected layers from available results', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [{ serviceId: 9, layerNames: ['or007tur_estades'] }],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_altres'],
        layerIdLabel: 'or007tur_altres',
        layerName: 'Altres allotjaments',
      },
    ];

    component.postFetchData();
    (component as any).onServiceFilterChange(9);

    expect((component as any).filteredLayerOptions).toEqual([
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_altres'],
        layerIdLabel: 'or007tur_altres',
        layerName: 'Altres allotjaments',
      },
    ]);
  });

  it('adds selected layer option into mapSources payload and marks form dirty', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
    ];

    component.postFetchData();
    component.entityForm.patchValue({
      name: 'Map image task',
      taskGroupId: 2,
      format: 'png',
      width: 1024,
      height: 768,
      srs: 'EPSG:25831',
      bboxMarginPercent: 10,
    });
    component.entityForm.markAsPristine();

    (component as any).addLayer((component as any).availableLayerOptions[0]);

    expect(component.entityForm.valid).toBe(true);
    expect(component.mapSourcesArray.length).toBe(1);
    expect(component.entityForm.dirty).toBe(true);
    expect(component.mapSourcesArray.dirty).toBe(true);
    expect(component.canSaveEntity).toBe(true);
    expect(component.mapSourcesArray.at(0)?.get('serviceId')?.value).toBe(9);
    expect(component.mapSourcesArray.at(0)?.get('layerNames')?.value).toEqual(['or007tur_estades']);
  });

  it('keeps current filter text and removes added layer from filtered results', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_establiments'],
        layerIdLabel: 'or007tur_establiments',
        layerName: 'Establiments turistics',
      },
    ];

    component.postFetchData();
    (component as any).onServiceFilterChange(9);
    (component as any).onLayerSearchTextChange('esta');

    (component as any).onLayerOptionSelected({
      option: {
        value: (component as any).availableLayerOptions[0],
      },
    });

    expect((component as any).layerSearchText).toBe('esta');
    expect((component as any).filteredLayerOptions).toEqual([
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_establiments'],
        layerIdLabel: 'or007tur_establiments',
        layerName: 'Establiments turistics',
      },
    ]);
  });

  it('restores original task state after adding and removing a layer', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        format: 'png',
        width: 1024,
        height: 768,
        srs: 'EPSG:25831',
        bboxMarginPercent: 15,
        mapSources: [{ serviceId: 9, layerNames: ['or007tur_original'] }],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_original'],
        layerIdLabel: 'or007tur_original',
        layerName: 'Capa original',
      },
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
    ];

    component.postFetchData();

    (component as any).addLayer((component as any).availableLayerOptions[1]);
    expect(component.mapSourcesArray.at(0)?.get('layerNames')?.value).toEqual(['or007tur_original', 'or007tur_estades']);
    expect(component.entityForm.dirty).toBe(true);
    expect(component.canSaveEntity).toBe(true);

    const addedRowIndex = (component as any).selectedLayerRows.findIndex((row: any) => row.layerIdLabel === 'or007tur_estades');
    (component as any).removeLayer(addedRowIndex);

    expect(component.mapSourcesArray.length).toBe(1);
    expect(component.mapSourcesArray.at(0)?.get('serviceId')?.value).toBe(9);
    expect(component.mapSourcesArray.at(0)?.get('layerNames')?.value).toEqual(['or007tur_original']);
    expect(component.entityForm.dirty).toBe(true);
    expect(component.canSaveEntity).toBe(true);
  });

  it('createObject preserves unknown properties and filters invalid map sources', () => {
    component.entityToEdit = {
      id: 77,
      name: 'Map image task',
      groupId: 2,
      properties: {
        custom: true,
        mapSources: [
          { serviceId: 9, layerNames: ['layer_a'] },
        ],
      },
    } as any;
    (component as any).availableLayerOptions = [];

    component.postFetchData();
    component.entityForm.patchValue({
      name: 'Updated task',
      format: 'png',
      width: 512,
      height: 256,
      srs: 'EPSG:25831',
      bboxMarginPercent: 12,
    });
    component.mapSourcesArray.clear();
    component.mapSourcesArray.push((component as any).createMapSourceGroup({ serviceId: 10, layerNames: [' layer_b ', '', 'layer_b'] }));
    component.mapSourcesArray.push((component as any).createMapSourceGroup({ serviceId: null, layerNames: ['ignored'] }));

    const task = component.createObject(77);

    expect(task.properties.custom).toBe(true);
    expect(task.properties.bboxMarginPercent).toBe(12);
    expect(task.properties.mapSources).toEqual([{ serviceId: 10, layerNames: ['layer_b'] }]);
  });

  it('preserves stored layer order when building selected rows', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [{ serviceId: 9, layerNames: ['layer_b', 'layer_a'] }],
      },
    } as any;
    (component as any).services = [
      { id: 9, name: 'Tourism WMS' } as Service,
    ];
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['layer_a'],
        layerIdLabel: 'layer_a',
        layerName: 'Layer A',
      },
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['layer_b'],
        layerIdLabel: 'layer_b',
        layerName: 'Layer B',
      },
    ];

    component.postFetchData();

    expect((component as any).selectedLayerRows.map((row: any) => row.layerId)).toEqual(['layer_b', 'layer_a']);
  });

  it('deduplicates added layers without changing original order', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [{ serviceId: 9, layerNames: ['layer_b', 'layer_a'] }],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['layer_a', 'layer_c'],
        layerIdLabel: 'layer_a, layer_c',
        layerName: 'Layer group',
      },
    ];

    component.postFetchData();

    (component as any).addLayer((component as any).availableLayerOptions[0]);

    expect(component.mapSourcesArray.at(0)?.get('layerNames')?.value).toEqual(['layer_b', 'layer_a', 'layer_c']);
  });

  it('appends added layer at the end when same service is not the last source', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [
          { serviceId: 9, layerNames: ['layer_a'] },
          { serviceId: 10, layerNames: ['layer_b'] },
        ],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['layer_a', 'layer_c'],
        layerIdLabel: 'layer_a, layer_c',
        layerName: 'Layer group',
      },
    ];

    component.postFetchData();

    (component as any).addLayer((component as any).availableLayerOptions[0]);

    expect(component.mapSourcesArray.length).toBe(3);
    expect(component.mapSourcesArray.at(0)?.get('serviceId')?.value).toBe(9);
    expect(component.mapSourcesArray.at(0)?.get('layerNames')?.value).toEqual(['layer_a']);
    expect(component.mapSourcesArray.at(1)?.get('serviceId')?.value).toBe(10);
    expect(component.mapSourcesArray.at(1)?.get('layerNames')?.value).toEqual(['layer_b']);
    expect(component.mapSourcesArray.at(2)?.get('serviceId')?.value).toBe(9);
    expect(component.mapSourcesArray.at(2)?.get('layerNames')?.value).toEqual(['layer_c']);
  });

  it('reorders selected layers and stores only consecutive same-service layers together', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [
          { serviceId: 9, layerNames: ['layer_a', 'layer_c'] },
          { serviceId: 10, layerNames: ['layer_b'] },
        ],
      },
    } as any;

    component.postFetchData();
    component.entityForm.markAsPristine();

    (component as any).onSelectedLayerOrderChanged([
      { serviceId: 9, serviceName: 'Tourism WMS', layerId: 'layer_a', layerIdLabel: 'layer_a', layerName: 'Layer A', missing: false, status: 'statusOK', newItem: false },
      { serviceId: 10, serviceName: 'Urbanism WMS', layerId: 'layer_b', layerIdLabel: 'layer_b', layerName: 'Layer B', missing: false, status: 'statusOK', newItem: false },
      { serviceId: 9, serviceName: 'Tourism WMS', layerId: 'layer_c', layerIdLabel: 'layer_c', layerName: 'Layer C', missing: false, status: 'statusOK', newItem: false },
    ]);

    expect(component.mapSourcesArray.length).toBe(3);
    expect(component.mapSourcesArray.at(0)?.get('serviceId')?.value).toBe(9);
    expect(component.mapSourcesArray.at(0)?.get('layerNames')?.value).toEqual(['layer_a']);
    expect(component.mapSourcesArray.at(1)?.get('serviceId')?.value).toBe(10);
    expect(component.mapSourcesArray.at(1)?.get('layerNames')?.value).toEqual(['layer_b']);
    expect(component.mapSourcesArray.at(2)?.get('serviceId')?.value).toBe(9);
    expect(component.mapSourcesArray.at(2)?.get('layerNames')?.value).toEqual(['layer_c']);
    expect(component.entityForm.dirty).toBe(true);
  });

  it('removes selected layer from mapSources payload and marks form dirty', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        format: 'png',
        width: 1024,
        height: 768,
        srs: 'EPSG:25831',
        bboxMarginPercent: 15,
        mapSources: [{ serviceId: 9, layerNames: ['or007tur_estades'] }],
      },
    } as any;
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
    ];

    component.postFetchData();
    component.entityForm.markAsPristine();
    (component as any).removeLayer(0);

    expect(component.mapSourcesArray.length).toBe(0);
    expect(component.entityForm.dirty).toBe(true);
    expect(component.mapSourcesArray.dirty).toBe(true);
    expect(component.canSaveEntity).toBe(true);
  });

  it('shows selected layers with friendly names and fallback rows', () => {
    component.entityToEdit = {
      name: 'Map image task',
      groupId: 2,
      properties: {
        mapSources: [
          { serviceId: 9, layerNames: ['or007tur_estades'] },
          { serviceId: 10, layerNames: ['missing_layer'] },
        ],
      },
    } as any;
    (component as any).services = [
      { id: 9, name: 'Tourism WMS' } as Service,
      { id: 10, name: 'Urbanism WMS' } as Service,
    ];
    (component as any).availableLayerOptions = [
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerIds: ['or007tur_estades'],
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
      },
    ];

    component.postFetchData();

    expect((component as any).selectedLayerRows).toEqual([
      {
        serviceId: 9,
        serviceName: 'Tourism WMS',
        layerId: 'or007tur_estades',
        layerIdLabel: 'or007tur_estades',
        layerName: 'Estades i habitatges turistics vacacionals',
        missing: false,
      },
      {
        serviceId: 10,
        serviceName: 'Urbanism WMS',
        layerId: 'missing_layer',
        layerIdLabel: 'missing_layer',
        layerName: 'missing_layer',
        missing: true,
      },
    ]);
  });
});
