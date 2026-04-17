import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { TaskTemplateFormComponent } from './task-template-form.component';

describe('TaskTemplateFormComponent', () => {
  let component: TaskTemplateFormComponent;
  let previewService: Record<string, jest.Mock>;
  let http: Record<string, jest.Mock>;

  const createSpyObj = (methods: string[]) => {
    return methods.reduce((acc, methodName) => {
      acc[methodName] = jest.fn();
      return acc;
    }, {} as Record<string, jest.Mock>);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({}),
            }),
          },
        }),
      ],
    });

    const translateService = createSpyObj(['instant', 'get']);
    translateService.instant.mockImplementation((key: string) => key);
    previewService = createSpyObj(['executeLinkedTask', 'previewTemplate']);
    previewService.previewTemplate.mockReturnValue(of({ html: '', placeholders: [] }));
    http = createSpyObj(['get']);
    http.get.mockReturnValue(of({ APP_ID: '#{application.id}', TERR_ID: '#{territory.id}', APP_NAME: '#{application.name}' }));

    component = TestBed.runInInjectionContext(() => new TaskTemplateFormComponent(
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
      createSpyObj(['create', 'update', 'getProjection']) as any,
      createSpyObj(['getAllEx']) as any,
      createSpyObj(['getAllEx', 'createProxy']) as any,
      createSpyObj(['create', 'delete']) as any,
      previewService as any,
      createSpyObj(['navigateBack']) as any,
      http as any,
    ));

    (component as any).linkableTasks = [
      { relationType: 'template-task', taskId: 13, name: 'Consulta padron', typeLabel: 'Consulta SQL' },
      { relationType: 'template-nested', taskId: 15, name: 'Plantilla hija', typeLabel: 'Plantilla' },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with name and task group controls', () => {
    component.entityToEdit = {
      name: 'Template 1',
      groupId: 2,
      properties: {},
    } as any;

    component.postFetchData();

    expect(component.entityForm.get('name')?.value).toBe('Template 1');
    expect(component.entityForm.get('taskGroupId')?.value).toBe(2);
    expect(component.entityForm.get('templateHtml')?.value).toBe('');
  });

  it('should filter out authenticated web api tasks from linkable query tasks', () => {
    const tasks = [
      { id: 1, typeId: 5, name: 'SQL', properties: { scope: 'sql-query' } },
      { id: 2, typeId: 5, name: 'API auth', properties: { scope: 'web-api-query', authenticationMode: 'X-API-Key' } },
      { id: 3, typeId: 5, name: 'API open', properties: { scope: 'web-api-query' } },
      { id: 4, typeId: 5, name: 'Resource', properties: { scope: 'resource' } },
      { id: 5, typeId: 5, name: 'Cartography', properties: { scope: 'cartography-query' } },
    ] as any;

    const filtered = (component as any).filterLinkableQueryTasks(tasks);

    expect(filtered.map((task: any) => task.taskId)).toEqual([1, 3, 4]);
    expect((component as any).excludedAuthenticatedApiTasks).toBe(1);
  });

  it('should remove linked task from local list', () => {
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
      { relationType: 'template-nested', taskId: 15, name: 'Plantilla', typeLabel: 'Plantilla', relationId: 2 },
    ];
    component.entityForm = new FormGroup({ name: new FormControl('A'), taskGroupId: new FormControl(1) });

    (component as any).removeLinkedTask(13, 'template-task');

    expect((component as any).linkedTasks).toEqual([
      { relationType: 'template-nested', taskId: 15, name: 'Plantilla', typeLabel: 'Plantilla', relationId: 2 },
    ]);
  });

  it('should resolve linked task from lookup map', () => {
    const projection = { id: 13, name: 'Consulta padron' } as any;
    (component as any).taskLookup.set(13, projection);

    expect((component as any).resolveTask(13)).toBe(projection);
  });

  it('should not render preview automatically when the editor value changes', () => {
    component.entityToEdit = {
      name: 'Template 1',
      groupId: 2,
      properties: {},
    } as any;

    component.postFetchData();
    previewService.previewTemplate.mockClear();

    component.entityForm.get('templateHtml')?.setValue('tui name: {{task_13.tui_name}}');

    expect(previewService.previewTemplate).not.toHaveBeenCalled();
  });

  it('should not render preview automatically after executing a linked task', () => {
    component.entityToEdit = {
      properties: {},
    } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('tui name: {{task_13.tui_name}}'),
    });

    previewService.previewTemplate.mockClear();

    (component as any).onTaskExecuted({
      taskId: 13,
      status: 'COMPLETED',
      resultType: 'table',
      parameters: {},
      context: { tui_name: 'layerCatalog' },
      rows: [{ tui_name: 'layerCatalog' }],
      resourceUrl: null,
      flattenedContextKeys: ['tui_name'],
    });

    expect(previewService.previewTemplate).not.toHaveBeenCalled();
  });

  it('should render preview only when requested explicitly', () => {
    component.entityToEdit = {
      properties: {
        previewContext: {
          task_13: { tui_name: 'layerCatalog' },
        },
      },
    } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('tui name: {{task_13.tui_name}}'),
    });
    previewService.previewTemplate.mockReturnValue(of({
      html: '<p>tui name: layerCatalog</p>',
      placeholders: ['task_13.tui_name'],
    }));

    (component as any).renderPreview();

    expect(previewService.previewTemplate).toHaveBeenCalledWith('tui name: {{task_13.tui_name}}', {
      task_13: { tui_name: 'layerCatalog' },
    });
    expect((component as any).previewHtml).toBe('<p>tui name: layerCatalog</p>');
  });

  it('should keep preview errors local to the preview panel', () => {
    component.entityToEdit = {
      properties: {},
    } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('tui name: {{task_'),
    });
    previewService.previewTemplate.mockReturnValue(throwError(() => ({
      error: {
        detail: 'Handlebars syntax error',
      },
    })));

    (component as any).renderPreview();

    expect((component as any).previewHtml).toBe('');
    expect((component as any).previewError).toBe('Handlebars syntax error');
  });

  it('formats template system variable help from loaded variables', () => {
    (component as any).systemVariables = new Map([
      ['APP_ID', '#{application.id}'],
      ['TERR_ID', '#{territory.id}'],
      ['APP_NAME', '#{application.name}'],
    ]);

    expect((component as any).getSystemVariablesHelp()).toBe('{{#APP_ID}}, {{#APP_NAME}}, {{#TERR_ID}}');
  });

  it('should append copied placeholders at the end of the editor html', () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<p>hola</p>'),
    });

    (component as any).appendPlaceholderToTemplate('{{task_32292}}');

    expect(component.entityForm.get('templateHtml')?.value).toBe('<p>hola</p><p>{{task_32292}}</p>');
  });
});
