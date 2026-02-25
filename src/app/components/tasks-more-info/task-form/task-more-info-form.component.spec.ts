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
      'getEditableColumnDef'
    ]);
    utilsService.getSelCheckboxColumnDef.mockReturnValue({});
    utilsService.getRouterLinkColumnDef.mockReturnValue({});
    utilsService.getNonEditableColumnDef.mockReturnValue({});
    utilsService.getStatusColumnDef.mockReturnValue({});
    utilsService.getNonEditableDateColumnDef.mockReturnValue({});
    utilsService.getEditableColumnDef.mockReturnValue({});

    component = TestBed.runInInjectionContext(() => new TaskMoreInfoFormComponent(
      {} as any,
      translateService as any,
      createSpyObj(['getAllByNameAndEntity']) as any,
      createSpyObj(['getAllByName']) as any,
      createSpyObj(['error', 'warn', 'debug', 'info']) as any,
      createSpyObj(['handleError']) as any,
      {params: new FormControl({})} as any,
      createSpyObj(['navigate']) as any,
      createSpyObj(['show', 'hide']) as any,
      createSpyObj(['enable', 'disable']) as any,
      createSpyObj(['create', 'update', 'getProjection', 'createProxy']) as any,
      createSpyObj(['getAllEx']) as any,
      createSpyObj(['getAllEx', 'createProxy']) as any,
      createSpyObj(['getAll', 'createProxy']) as any,
      createSpyObj(['getAll', 'createProxy']) as any,
      utilsService as any,
      createSpyObj(['getAll']) as any,
      createSpyObj(['getAllProjection', 'createProxy']) as any,
      createSpyObj(['create', 'delete', 'createProxy']) as any,
      createSpyObj(['getAll', 'createProxy']) as any
    ));

    (component as any).cartographies = [
      {id: 10, name: 'Base map'},
      {id: 11, name: 'Ortofoto'}
    ];
    (component as any).taskGroupList = [{id: 1, name: 'Group A'}];
    (component as any).connections = [{id: 5, name: 'Main Connection'}];
  });

  const setupForm = (properties: any = {}) => {
    jest.spyOn(component as any, 'defaultValueOrNull').mockReturnValue({value: 'BASIC'});
    component.entityToEdit = {
      name: 'Task more info',
      groupId: 1,
      cartographyId: 10,
      connectionId: 5,
      properties
    } as any;

    component.postFetchData();
  };

  it('should create form with mapped legacy api scope', () => {
    setupForm({
      dataAccessType: 'api',
      command: '/endpoint'
    });

    expect(component.entityForm.get('scope')?.value).toBe('API');
    expect(component.entityForm.get('command')?.value).toBe('/endpoint');
    expect(component.entityForm.get('authenticationMode')?.value).toBe('BASIC');
  });

  it('should initialize cartography search value from selected cartography', () => {
    setupForm({scope: 'SQL', command: 'select * from table'});

    expect((component as any).cartographySearchControl.value).toBe('Base map');
  });

  it('should return names for task group and connection', () => {
    expect(component.getTaskGroupName(1)).toBe('Group A');
    expect(component.getConnectionName(5)).toBe('Main Connection');
    expect(component.getTaskGroupName(999)).toBe('');
    expect(component.getConnectionName(999)).toBe('');
  });

  it('should detect current access type from scope', () => {
    setupForm({scope: 'SQL', command: 'select 1'});
    expect(component.isSqlAccessType()).toBeTruthy();
    expect(component.isApiAccessType()).toBeFalsy();
    expect(component.isUrlRedirectAccessType()).toBeFalsy();

    component.entityForm.get('scope')?.setValue('API');
    expect(component.isApiAccessType()).toBeTruthy();

    component.entityForm.get('scope')?.setValue('URL');
    expect(component.isUrlRedirectAccessType()).toBeTruthy();
  });

  it('should show command hint when parameter count does not match', () => {
    setupForm({
      scope: 'API',
      command: '/service/${id}/${code}',
      parameters: [{label: 'id'}]
    });

    expect((component as any).shouldShowCommandAlertHint()).toBeTruthy();
  });

  it('should hide command hint when command parameters match declaration', () => {
    setupForm({
      scope: 'API',
      command: '/service/${id}/${code}',
      parameters: [{label: 'id'}, {label: 'code'}]
    });

    expect((component as any).shouldShowCommandAlertHint()).toBeFalsy();
  });

  it('should reset api credentials when scope changes from API', () => {
    setupForm({scope: 'API', command: '/service/${id}', authenticationMode: 'BASIC', user: 'u', password: 'p'});

    component.onScopeChange({value: 'SQL'} as any);

    expect(component.entityForm.get('authenticationMode')?.value).toBeNull();
    expect(component.entityForm.get('user')?.value).toBeNull();
    expect(component.entityForm.get('password')?.value).toBeNull();
  });

  it('should reset connection and apply default auth mode when changing to API', () => {
    setupForm({scope: 'SQL', command: 'select * from t'});
    component.entityForm.get('connectionId')?.setValue(5);
    component.entityForm.get('authenticationMode')?.setValue(null);

    component.onScopeChange({value: 'API'} as any);

    expect(component.entityForm.get('connectionId')?.value).toBeNull();
    expect(component.entityForm.get('authenticationMode')?.value).toBe('BASIC');
  });

  it('should initialize api key controls from headers', () => {
    setupForm({
      scope: 'API',
      command: '/service',
      headers: {
        'X-API-Key': 'secret-key'
      }
    });

    expect(component.entityForm.get('addApiKey')?.value).toBeTruthy();
    expect(component.entityForm.get('apiKey')?.value).toBe('secret-key');
  });

  it('should include X-API-Key header when checkbox is checked', () => {
    setupForm({scope: 'API', command: '/service'});
    component.entityForm.get('addApiKey')?.setValue(true);
    component.entityForm.get('apiKey')?.setValue('my-api-key');

    const task = component.createObject();

    expect(task.properties?.headers?.['X-API-Key']).toBe('my-api-key');
  });

  it('should remove X-API-Key header when checkbox is unchecked', () => {
    setupForm({
      scope: 'API',
      command: '/service',
      headers: {
        'X-API-Key': 'old-key',
        Authorization: 'Bearer token'
      }
    });
    component.entityForm.get('addApiKey')?.setValue(false);

    const task = component.createObject();

    expect(task.properties?.headers?.['X-API-Key']).toBeUndefined();
    expect(task.properties?.headers?.Authorization).toBe('Bearer token');
  });

  it('should update cartography id and search value on selection', () => {
    setupForm({scope: 'SQL', command: 'select 1'});

    component.onCartographySelected({
      option: {
        value: {id: 11, name: 'Ortofoto'}
      }
    } as any);

    expect(component.entityForm.get('cartographyId')?.value).toBe(11);
    expect((component as any).cartographySearchControl.value).toBe('Ortofoto');
  });
});
