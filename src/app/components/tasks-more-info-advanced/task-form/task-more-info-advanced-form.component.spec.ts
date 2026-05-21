import {TestBed} from '@angular/core/testing';
import {FormControl} from '@angular/forms';
import {of, throwError} from 'rxjs';

import {TaskMoreInfoAdvancedFormComponent} from './task-more-info-advanced-form.component';

describe('TaskMoreInfoAdvancedFormComponent', () => {
  let component: TaskMoreInfoAdvancedFormComponent;

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

    component = TestBed.runInInjectionContext(() => new TaskMoreInfoAdvancedFormComponent(
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
      createSpyObj(['create', 'update', 'getProjection', 'getAllProjection', 'createProxy']) as any,
      createSpyObj(['getAllEx']) as any,
      createSpyObj(['getAllEx', 'createProxy']) as any,
      createSpyObj(['getAll']) as any,
      utilsService as any,
      createSpyObj(['getAll']) as any,
      createSpyObj(['getAllProjection', 'createProxy']) as any,
      createSpyObj(['create', 'delete', 'createProxy']) as any
    ));
  });

  const queryTask = {
    id: 201,
    name: 'Child URL',
    typeId: 5,
    typeName: 'URL',
    properties: {
      parameters: [
        {label: 'layerid', value: 'layerid'}
      ]
    }
  } as any;

  const templateTask = {
    id: 301,
    name: 'Template child',
    typeId: 15,
    typeName: 'Plantilla',
    properties: {
      parameters: [
        {name: 'templateParam', type: 'string', value: 'template_param'}
      ]
    }
  } as any;

  const nestedApiTask = {
    id: 401,
    name: 'Nested API',
    typeId: 5,
    typeName: 'Web API',
    properties: {
      parameters: [
        {label: 'innerCode', value: 'inner_code'}
      ]
    }
  } as any;

  const nestedTemplateTask = {
    id: 402,
    name: 'Nested template',
    typeId: 15,
    typeName: 'Plantilla',
    properties: {
      parameters: [
        {name: 'nestedTemplateParam', type: 'string', value: 'nested_template_param'}
      ]
    }
  } as any;

  const deepNestedQueryTask = {
    id: 403,
    name: 'Deep nested query',
    typeId: 5,
    typeName: 'Consulta',
    properties: {
      parameters: [
        {label: 'deepCode', value: 'deep_code'}
      ]
    }
  } as any;

  const setupForm = (properties: any = {}) => {
    component.entityToEdit = {
      id: 100,
      name: 'Advanced info',
      groupId: 1,
      cartographyId: 10,
      properties: {
        parameters: [
          {label: 'featureCode', value: 'feature_code'},
          {label: 'featureName', value: 'feature_name'}
        ],
        ...properties
      }
    } as any;
    (component as any).cartographies = [{id: 10, name: 'Base map'}];
    (component as any).allCandidateTasks = [queryTask, templateTask, nestedTemplateTask];
    (component as any).templateChildTasks = new Map([[templateTask.id, [
      {task: nestedApiTask, referenceAlias: 'nested_api'},
      {task: nestedTemplateTask, referenceAlias: 'nested_template'}
    ]], [nestedTemplateTask.id, [
      {task: deepNestedQueryTask, referenceAlias: 'deep_query'}
    ]]]);

    component.postFetchData();
  };

  it('serializes direct and nested template child parameter mappings separately', () => {
    setupForm({childTaskOrderIds: [queryTask.id, templateTask.id]});
    (component as any).childTaskParameterMappings.set(queryTask.id, [
      {miaParam: 'featureCode', childParam: 'layerid'}
    ]);
    (component as any).childTaskParameterMappings.set(templateTask.id, [
      {miaParam: 'featureName', childParam: 'templateParam'}
    ]);
    (component as any).templateChildTaskParameterMappings.set(templateTask.id, new Map([[nestedApiTask.id, [
      {miaParam: 'featureCode', childParam: 'innerCode'}
    ]]]));

    const task = component.createObject(100) as any;

    expect(task.properties.childTaskParameters).toEqual({
      '201': {layerid: 'feature_code'},
      '301': {templateParam: 'feature_name'}
    });
    expect(task.properties.templateChildTaskParameters).toEqual({
      '301': {
        '401': {innerCode: 'feature_code'}
      }
    });
  });

  it('deserializes nested template child parameter mappings on edit', () => {
    setupForm({
      childTaskOrderIds: [templateTask.id],
      childTaskParameters: {
        '301': {templateParam: 'feature_name'}
      },
      templateChildTaskParameters: {
        '301': {
          '401': {innerCode: 'feature_code'}
        }
      }
    });

    expect((component as any).getChildMappings(templateTask.id)).toEqual([
      {miaParam: 'featureName', childParam: 'templateParam'}
    ]);
    expect((component as any).getTemplateChildMappings(templateTask.id, nestedApiTask.id)).toEqual([
      {miaParam: 'featureCode', childParam: 'innerCode'}
    ]);
  });

  it('adds and removes nested mappings only for template child tasks', () => {
    setupForm({childTaskOrderIds: [queryTask.id, templateTask.id]});

    expect((component as any).isTemplateTask(queryTask)).toBe(false);
    expect((component as any).getTemplateChildLinks(queryTask).length).toBe(0);
    expect((component as any).isTemplateTask(templateTask)).toBe(true);
    expect((component as any).getTemplateChildLinks(templateTask)).toEqual([
      {task: nestedApiTask, referenceAlias: 'nested_api'},
      {task: nestedTemplateTask, referenceAlias: 'nested_template'}
    ]);

    (component as any).addTemplateChildMapping(templateTask.id, nestedApiTask.id);
    expect((component as any).getTemplateChildMappings(templateTask.id, nestedApiTask.id)).toEqual([
      {miaParam: '', childParam: ''}
    ]);

    (component as any).removeTemplateChildMapping(templateTask.id, nestedApiTask.id, 0);
    expect((component as any).getTemplateChildMappings(templateTask.id, nestedApiTask.id)).toEqual([]);
  });

  it('does not serialize mappings whose MIA parameter is no longer declared', () => {
    setupForm({childTaskOrderIds: [queryTask.id, templateTask.id]});
    (component as any).childTaskParameterMappings.set(queryTask.id, [
      {miaParam: 'featureCode', childParam: 'layerid'},
      {miaParam: 'deletedFeature', childParam: 'stale'}
    ]);
    (component as any).templateChildTaskParameterMappings.set(templateTask.id, new Map([[nestedApiTask.id, [
      {miaParam: 'featureName', childParam: 'innerCode'},
      {miaParam: 'renamedFeature', childParam: 'staleInner'}
    ]]]));

    const task = component.createObject(100) as any;

    expect(task.properties.childTaskParameters).toEqual({
      '201': {layerid: 'feature_code'}
    });
    expect(task.properties.templateChildTaskParameters).toEqual({
      '301': {
        '401': {innerCode: 'feature_name'}
      }
    });
  });

  it('keeps mapping view data stable and initializes missing arrays outside template getters', () => {
    setupForm({childTaskOrderIds: [queryTask.id, templateTask.id]});

    const directMapSize = (component as any).childTaskParameterMappings.size;
    const nestedMapSize = (component as any).templateChildTaskParameterMappings.get(templateTask.id).size;

    expect((component as any).includedTaskMappingViews.map((view: any) => view.task.id)).toEqual([queryTask.id, templateTask.id]);
    expect((component as any).includedTaskMappingViews[1].templateChildViews).toEqual([
      expect.objectContaining({task: nestedApiTask, referenceAlias: 'nested_api', mappings: [], childNodes: []}),
      expect.objectContaining({task: nestedTemplateTask, referenceAlias: 'nested_template', mappings: []})
    ]);
    expect((component as any).getChildMappings(queryTask.id)).toBe((component as any).includedTaskMappingViews[0].mappings);
    expect((component as any).getTemplateChildMappings(templateTask.id, nestedApiTask.id))
      .toBe((component as any).includedTaskMappingViews[1].templateChildViews[0].mappings);
    expect((component as any).childTaskParameterMappings.size).toBe(directMapSize);
    expect((component as any).templateChildTaskParameterMappings.get(templateTask.id).size).toBe(nestedMapSize);
  });

  it('normalizes template parameter shape for direct and nested mapping selectors', () => {
    setupForm({childTaskOrderIds: [templateTask.id]});

    const rootView = (component as any).includedTaskMappingViews[0];
    const nestedTemplateView = rootView.templateChildViews.find((view: any) => view.task.id === nestedTemplateTask.id);

    expect(rootView.childParameters).toEqual([
      expect.objectContaining({label: 'templateParam', value: 'template_param'})
    ]);
    expect(nestedTemplateView.childParameters).toEqual([
      expect.objectContaining({label: 'nestedTemplateParam', value: 'nested_template_param'})
    ]);
  });

  it('builds recursive template mapping views for nested templates', () => {
    setupForm({childTaskOrderIds: [templateTask.id]});

    const rootView = (component as any).includedTaskMappingViews[0];
    const nestedTemplateView = rootView.templateChildViews.find((view: any) => view.task.id === nestedTemplateTask.id);
    const nestedApiView = rootView.templateChildViews.find((view: any) => view.task.id === nestedApiTask.id);

    expect(rootView.isTemplate).toBe(true);
    expect(rootView.mappings).toBe((component as any).getChildMappings(templateTask.id));
    expect(nestedApiView).toEqual(expect.objectContaining({
      rootTemplateTaskId: templateTask.id,
      task: nestedApiTask,
      referenceAlias: 'nested_api',
      isTemplate: false,
      renderAsAccordion: false,
      expandedByDefault: true,
      childNodes: []
    }));
    expect(nestedTemplateView).toEqual(expect.objectContaining({
      rootTemplateTaskId: templateTask.id,
      task: nestedTemplateTask,
      referenceAlias: 'nested_template',
      isTemplate: true,
      renderAsAccordion: true,
      expandedByDefault: true
    }));
    expect(nestedTemplateView.mappings).toBe((component as any).getTemplateChildMappings(templateTask.id, nestedTemplateTask.id));
    expect(nestedTemplateView.childNodes).toEqual([
      expect.objectContaining({
        rootTemplateTaskId: templateTask.id,
        task: deepNestedQueryTask,
        referenceAlias: 'deep_query',
        isTemplate: false,
        expandedByDefault: false,
        childNodes: []
      })
    ]);
  });

  it('skips broken template child metadata and keeps loading other children', async () => {
    const brokenTemplate = {
      id: 501,
      name: 'Broken template',
      typeId: 15,
      getRelationArrayEx: jest.fn().mockReturnValue(throwError(() => new Error('relations unavailable')))
    } as any;
    const partiallyBrokenTemplate = {
      id: 502,
      name: 'Partially broken template',
      typeId: 15,
      getRelationArrayEx: jest.fn().mockReturnValue(of([
        {relationType: 'template-task', getRelationEx: jest.fn().mockReturnValue(throwError(() => new Error('missing related task')))},
        {relationType: 'template-task', referenceAlias: 'ok_child', getRelationEx: jest.fn().mockReturnValue(of(nestedApiTask))}
      ]))
    } as any;

    await (component as any).loadTemplateChildTasks([brokenTemplate, partiallyBrokenTemplate, nestedApiTask]);

    expect((component as any).templateChildTasks.get(brokenTemplate.id)).toEqual([]);
    expect((component as any).templateChildTasks.get(partiallyBrokenTemplate.id)).toEqual([
      {task: nestedApiTask, referenceAlias: 'ok_child'}
    ]);
  });

  it('loads nested template metadata recursively for descendant templates', async () => {
    const discoveredNestedTemplate = {
      ...nestedTemplateTask,
      getRelationArrayEx: jest.fn().mockReturnValue(of([
        {relationType: 'template-task', referenceAlias: 'deep_query', getRelationEx: jest.fn().mockReturnValue(of(deepNestedQueryTask))}
      ]))
    } as any;
    const rootTemplate = {
      ...templateTask,
      getRelationArrayEx: jest.fn().mockReturnValue(of([
        {relationType: 'template-task', referenceAlias: 'nested_template', getRelationEx: jest.fn().mockReturnValue(of(discoveredNestedTemplate))}
      ]))
    } as any;

    await (component as any).loadTemplateChildTasks([rootTemplate, queryTask, deepNestedQueryTask]);

    expect((component as any).templateChildTasks.get(rootTemplate.id)).toEqual([
      {task: discoveredNestedTemplate, referenceAlias: 'nested_template'}
    ]);
    expect((component as any).templateChildTasks.get(discoveredNestedTemplate.id)).toEqual([
      {task: deepNestedQueryTask, referenceAlias: 'deep_query'}
    ]);
  });

  it('preserves explicit template expansion state across mapping rebuilds', () => {
    setupForm({childTaskOrderIds: [templateTask.id]});

    const rootView = (component as any).includedTaskMappingViews[0];
    const nestedTemplateView = rootView.templateChildViews.find((view: any) => view.task.id === nestedTemplateTask.id);

    expect(nestedTemplateView.expanded).toBe(true);

    (component as any).setTemplateNodeExpanded(nestedTemplateView.key, false);
    component.onMappingChanged();

    const rebuiltNestedTemplateView = (component as any).includedTaskMappingViews[0]
      .templateChildViews.find((view: any) => view.task.id === nestedTemplateTask.id);

    expect(rebuiltNestedTemplateView.expanded).toBe(false);
  });

  it('prunes stale direct and nested mappings when saving parameters from the grid', async () => {
    setupForm({
      childTaskOrderIds: [queryTask.id, templateTask.id],
      childTaskParameters: {
        '201': {layerid: 'feature_code', stale: 'deleted_feature'}
      },
      templateChildTaskParameters: {
        '301': {
          '401': {innerCode: 'feature_name', staleInner: 'renamed_feature'}
        }
      }
    });
    (component as any).taskService.update.mockReturnValue(of({}));

    await (component as any).parametersTable.relationsUpdateFn([
      {label: 'featureCode', value: 'feature_code'},
      {label: 'featureName', value: 'feature_name'}
    ]);

    expect(component.entityToEdit.properties.childTaskParameters).toEqual({
      '201': {layerid: 'feature_code'}
    });
    expect(component.entityToEdit.properties.templateChildTaskParameters).toEqual({
      '301': {
        '401': {innerCode: 'feature_name'}
      }
    });
    expect((component as any).taskService.update).toHaveBeenCalledWith(expect.objectContaining({
      properties: expect.objectContaining({
        childTaskParameters: {'201': {layerid: 'feature_code'}},
        templateChildTaskParameters: {'301': {'401': {innerCode: 'feature_name'}}}
      })
    }));
  });
});
