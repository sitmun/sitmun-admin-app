import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { TaskProjection } from '@app/domain';
import { magic } from '@environments/constants';

import { TaskLocatorFormComponent } from './task-locator-form.component';

describe('TaskLocatorFormComponent', () => {
  let component: TaskLocatorFormComponent;

  const createSpyObj = (methods: string[]) => {
    return methods.reduce((acc, methodName) => {
      acc[methodName] = jest.fn();
      return acc;
    }, {} as Record<string, jest.Mock>);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});

    const translateService = createSpyObj(['instant', 'get']);
    translateService.instant.mockImplementation((key: string) => key);

    const utilsService = createSpyObj([
      'getSelCheckboxColumnDef',
      'getRouterLinkColumnDef',
      'getNonEditableColumnDef',
      'getStatusColumnDef',
      'getNonEditableDateColumnDef'
    ]);
    utilsService.getSelCheckboxColumnDef.mockReturnValue({});
    utilsService.getRouterLinkColumnDef.mockReturnValue({});
    utilsService.getNonEditableColumnDef.mockReturnValue({});
    utilsService.getStatusColumnDef.mockReturnValue({});
    utilsService.getNonEditableDateColumnDef.mockReturnValue({});

    component = TestBed.runInInjectionContext(() => new TaskLocatorFormComponent(
      {} as any,
      translateService as any,
      createSpyObj(['getAllByNameAndEntity']) as any,
      createSpyObj(['getAllByName']) as any,
      createSpyObj(['error', 'warn', 'debug', 'info']) as any,
      createSpyObj(['handleError']) as any,
      { params: new FormControl({}) } as any,
      createSpyObj(['navigate']) as any,
      createSpyObj(['show', 'hide']) as any,
      createSpyObj(['enable', 'disable']) as any,
      createSpyObj(['create', 'update', 'fetchProjectionById', 'createProxy']) as any,
      createSpyObj(['create', 'update', 'delete', 'createProxy']) as any,
      createSpyObj(['fetchAllRawItems']) as any,
      createSpyObj(['fetchAllRawItems', 'createProxy']) as any,
      createSpyObj(['fetchAllRawItems', 'createProxy']) as any,
      utilsService as any,
      createSpyObj(['fetchAllItems']) as any,
      createSpyObj(['fetchProjectionItems', 'createProxy']) as any,
      createSpyObj(['fetchAllItems', 'delete', 'create', 'createProxy']) as any
    ));

    (component as any).taskService.createProxy.mockImplementation((id: number) => ({ id }));

    (component as any).taskGroupList = [{ id: 1, name: 'Group A' }];
    (component as any).queryTasks = [
      { id: 7, name: 'SQL geocoder', typeId: magic.taskQueryTypeId },
      { id: 8, name: 'API geocoder', typeId: magic.taskQueryTypeId }
    ];
  });

  const setupForm = (selectedQueryTaskId: number | null = 7, properties: Record<string, unknown> = {}) => {
    component.entityToEdit = TaskProjection.fromObject({
      name: 'Events locator',
      groupId: 1,
      properties
    });
    (component as any).selectedQueryTaskId = selectedQueryTaskId;
    component.postFetchData();
  };

  it('should create form with selected query task', () => {
    setupForm();

    expect(component.entityForm.get('name')?.value).toBe('Events locator');
    expect(component.entityForm.get('taskGroupId')?.value).toBe(1);
    expect(component.entityForm.get('queryTaskId')?.value).toBe(7);
    expect(component.queryTaskSearchControl.value).toEqual(
      expect.objectContaining({ id: 7, name: 'SQL geocoder' })
    );
  });

  it('should return task group name from loaded list', () => {
    expect(component.getTaskGroupName(1)).toBe('Group A');
    expect(component.getTaskGroupName(999)).toBe('');
  });

  it('should build a task relation that links locator to the selected query task', () => {
    const relation = (component as any).buildQueryTaskRelation(42, 7);

    expect(relation.relationType).toBe('query-task');
    expect(relation.task?.id).toBe(42);
    expect(relation.relatedTask?.id).toBe(7);
  });

  it('queryTaskValidator rejects unknown query task names', () => {
    setupForm(null);
    component.queryTaskSearchControl.setValue('Unknown task');

    const result = (component as any).queryTaskValidator(component.queryTaskSearchControl);

    expect(result).toEqual({ invalidQueryTask: true });
  });

  it('queryTaskValidator accepts a matching query task by name', () => {
    setupForm(null);
    component.queryTaskSearchControl.setValue('SQL geocoder');

    const result = (component as any).queryTaskValidator(component.queryTaskSearchControl);

    expect(result).toBeNull();
    expect(component.entityForm.get('queryTaskId')?.value).toBe(7);
  });

  it('createObject persists geocoder parameters from form values', () => {
    setupForm(7, {
      parameters: [{ variable: 'resultsPath', value: '/features' }]
    });

    component.entityForm.patchValue({
      geocoderLabelField: 'properties.display_name',
      geocoderResultsPath: 'features',
      geocoderFilterByExtent: true,
      geocoderEnableServiceParams: true,
      geocoderMunicipalityCodeFilters: [{
        requestParam: 'id_municipi',
        territoryField: 'territory_code',
        convertProjection: true,
        targetCrs: 'EPSG:4326'
      }]
    });

    const result = component.createObject(10);

    expect(result.properties?.parameters).toEqual(
      expect.arrayContaining([
        { variable: 'labelField', value: 'properties.display_name' },
        { variable: 'resultsPath', value: 'features' },
        { variable: 'filterByExtent', value: 'true' },
        { variable: 'enableServiceParams', value: 'true' },
        expect.objectContaining({
          variable: 'municipalityCodeFilters',
          value: expect.stringContaining('id_municipi')
        })
      ])
    );
  });

  it('displayQueryTask returns task name or string value', () => {
    expect(component.displayQueryTask('typed')).toBe('typed');
    expect(component.displayQueryTask({ id: 7, name: 'SQL geocoder' } as any)).toBe('SQL geocoder');
  });
});
