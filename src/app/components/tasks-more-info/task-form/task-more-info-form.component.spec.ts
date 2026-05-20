import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';

import {TaskMoreInfoFormComponent} from './task-more-info-form.component';

describe('TaskMoreInfoFormComponent', () => {
  let component: TaskMoreInfoFormComponent;

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
      'getNonEditableDateColumnDef',
      'getEditableColumnDef',
      'getBooleanColumnDef'
    ]);
    utilsService.getSelCheckboxColumnDef.mockReturnValue({});
    utilsService.getRouterLinkColumnDef.mockReturnValue({});
    utilsService.getNonEditableColumnDef.mockReturnValue({});
    utilsService.getStatusColumnDef.mockReturnValue({});
    utilsService.getNonEditableDateColumnDef.mockReturnValue({});
    utilsService.getEditableColumnDef.mockReturnValue({});
    utilsService.getBooleanColumnDef.mockReturnValue({});

    component = TestBed.runInInjectionContext(() => new TaskMoreInfoFormComponent(
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
      createSpyObj(['create', 'update', 'getProjection', 'createProxy']) as any,
      createSpyObj(['getAllEx', 'create', 'update', 'delete', 'createProxy']) as any,
      createSpyObj(['getAllEx']) as any,
      createSpyObj(['getAllEx', 'createProxy']) as any,
      createSpyObj(['getAll', 'createProxy']) as any,
      createSpyObj(['getAll', 'createProxy']) as any,
      utilsService as any,
      createSpyObj(['getAll']) as any,
      createSpyObj(['getAllProjection', 'createProxy']) as any,
      createSpyObj(['get']) as any
    ));

    (component as any).taskService.createProxy.mockImplementation((id: number) => ({ id }));

    (component as any).cartographies = [
      { id: 10, name: 'Base map' },
      { id: 11, name: 'Ortofoto' }
    ];
    (component as any).taskGroupList = [{ id: 1, name: 'Group A' }];
    (component as any).queryTasks = [
      { id: 7, name: 'SQL details', typeId: 5, properties: { scope: 'sql-query' } },
      { id: 8, name: 'API details', typeId: 5, properties: { scope: 'web-api-query' } }
    ];
  });

  const setupForm = (selectedQueryTaskId: number | null = 7, properties: any = {}) => {
    component.entityToEdit = {
      name: 'Task more info',
      groupId: 1,
      cartographyId: 10,
      properties
    } as any;
    (component as any).selectedQueryTaskId = selectedQueryTaskId;

    component.postFetchData();
  };

  it('should create form with selected query task and cartography', () => {
    setupForm();

    expect(component.entityForm.get('queryTaskId')?.value).toBe(7);
    expect(component.entityForm.get('cartographyId')?.value).toBe(10);
    expect((component as any).cartographySearchControl.value).toEqual({ id: 10, name: 'Base map' });
  });

  it('should return task group name and resolve query task from loaded list', () => {
    expect(component.getTaskGroupName(1)).toBe('Group A');
    expect((component as any).queryTasks.find((t: { id: number }) => t.id === 7)?.name).toBe('SQL details');
    expect(component.getTaskGroupName(999)).toBe('');
    expect((component as any).queryTasks.find((t: { id: number }) => t.id === 999)).toBeUndefined();
  });

  it('should update cartography id and search value on selection', () => {
    setupForm();

    const selected = { id: 11, name: 'Ortofoto' };
    (component as any).cartographySearchControl.setValue(selected);
    component.onCartographySelected({
      option: { value: selected }
    } as any);

    expect(component.entityForm.get('cartographyId')?.value).toBe(11);
    expect((component as any).cartographySearchControl.value).toEqual(selected);
  });

  it('should filter selectable query tasks excluding only cartography query tasks', () => {
    const tasks = [
      { id: 1, typeId: 5, cartographyId: 11, properties: { scope: 'cartography-query' } },
      { id: 2, typeId: 5, cartographyId: null, properties: { scope: 'sql-query' } },
      { id: 3, typeId: 5, cartographyId: null, properties: { scope: 'web-api-query' } },
      { id: 4, typeId: 5, cartographyId: null, properties: { scope: 'URL' } },
      { id: 5, typeId: 1, cartographyId: null, properties: { scope: 'basic' } }
    ] as any[];

    const filtered = (component as any).filterSelectableQueryTasks(tasks);

    expect(filtered.map((task: any) => task.id)).toEqual([2, 3, 4]);
  });

  it('should build a task relation that links more-info to the selected query task', () => {
    const relation = (component as any).buildQueryTaskRelation(42, 7);

    expect(relation.relationType).toBe('query-task');
    expect(relation.task?.id).toBe(42);
    expect(relation.relatedTask?.id).toBe(7);
  });

  it('should not expose provided field in more-info parameter dialog anymore', () => {
    (component as any).newParameterDialog = {} as any;

    const dialog = (component as any).parametersTable.templateDialog('newParameterDialog');
    const fields = (component as any).parametersTable.relationsColumnsDefs.map((column: any) => column.field);

    expect(dialog.form.contains('provided')).toBe(false);
    expect(fields).not.toContain('provided');
  });
});
