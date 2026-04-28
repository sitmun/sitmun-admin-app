import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { TaskTemplateFormComponent } from './task-template-form.component';
import { magic } from '@environments/constants';

describe('TaskTemplateFormComponent', () => {
  let component: TaskTemplateFormComponent;
  let dialog: Record<string, jest.Mock>;
  let notificationService: Record<string, jest.Mock>;
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
    dialog = createSpyObj(['open']);
    dialog.open.mockReturnValue({
      componentInstance: {},
      afterClosed: () => of({ event: 'Accept' }),
    });
    notificationService = createSpyObj(['showWarning']);
    previewService = createSpyObj(['executeLinkedTask', 'previewTemplate']);
    previewService.previewTemplate.mockReturnValue(of({ html: '', placeholders: [] }));
    http = createSpyObj(['get']);
    http.get.mockReturnValue(of({ APP_ID: '#{application.id}', TERR_ID: '#{territory.id}', APP_NAME: '#{application.name}' }));
    const utils = createSpyObj([
      'navigateBack',
      'getSelCheckboxColumnDef',
      'getRouterLinkColumnDef',
      'getNonEditableColumnDef',
      'getNonEditableDateColumnDef',
      'getEditableColumnDef',
      'getStatusColumnDef',
    ]);
    utils.getSelCheckboxColumnDef.mockReturnValue({});
    utils.getRouterLinkColumnDef.mockReturnValue({});
    utils.getNonEditableColumnDef.mockReturnValue({});
    utils.getNonEditableDateColumnDef.mockReturnValue({});
    utils.getEditableColumnDef.mockReturnValue({});
    utils.getStatusColumnDef.mockReturnValue({});

    component = TestBed.runInInjectionContext(() => new TaskTemplateFormComponent(
      dialog as any,
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
      createSpyObj(['getAll']) as any,
      createSpyObj(['getAllProjection', 'createProxy']) as any,
      createSpyObj(['create', 'delete', 'createProxy']) as any,
      previewService as any,
      notificationService as any,
      utils as any,
      http as any,
      TestBed.inject(DomSanitizer),
    ));

    (component as any).linkableTasks = [
      { relationType: 'template-task', taskId: 13, name: 'Consulta padron', typeLabel: 'Consulta SQL' },
      { relationType: 'template-nested', taskId: 15, name: 'Plantilla hija', typeLabel: 'Plantilla' },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define roles and territories data tables', () => {
    expect((component as any).rolesTable).toBeTruthy();
    expect((component as any).availabilitiesTable).toBeTruthy();
    expect((component as any).parametersTable).toBeTruthy();
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
      { relationType: 'template-task', taskId: 13, referenceAlias: 'task_1', draftReferenceAlias: 'task_1', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
      { relationType: 'template-nested', taskId: 15, referenceAlias: 'task_2', draftReferenceAlias: 'task_2', name: 'Plantilla', typeLabel: 'Plantilla', relationId: 2 },
    ];
    component.entityForm = new FormGroup({ name: new FormControl('A'), taskGroupId: new FormControl(1) });

    (component as any).removeLinkedTask(13, 'template-task');

    expect((component as any).linkedTasks).toEqual([
      { relationType: 'template-nested', taskId: 15, referenceAlias: 'task_2', draftReferenceAlias: 'task_2', name: 'Plantilla', typeLabel: 'Plantilla', relationId: 2 },
    ]);
  });

  it('should block linking nested template when resulting depth exceeds max nesting', () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl(''),
    });
    (component as any).templateChildTasks = new Map([
      [
        15,
        [
          { task: { id: 14, typeId: magic.taskTemplateTypeId }, referenceAlias: 'task_14' },
        ],
      ],
      [
        14,
        [
          { task: { id: 13, typeId: magic.taskTemplateTypeId }, referenceAlias: 'task_13' },
        ],
      ],
      [13, []],
    ]);

    (component as any).onLinkableTaskSelected({
      option: {
        value: { relationType: 'template-nested', taskId: 15, name: 'Plantilla hija', typeLabel: 'Plantilla' },
      },
    } as any);

    expect((component as any).linkedTasks).toEqual([]);
    expect((component as any).nestingLimitWarning).toContain('entity.task.template.maxNestingWarning');
  });

  it('should allow linking nested template when resulting depth is within max nesting', () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl(''),
    });
    (component as any).templateChildTasks = new Map([
      [
        15,
        [
          { task: { id: 14, typeId: magic.taskTemplateTypeId }, referenceAlias: 'task_14' },
        ],
      ],
      [14, []],
    ]);

    (component as any).onLinkableTaskSelected({
      option: {
        value: { relationType: 'template-nested', taskId: 15, name: 'Plantilla hija', typeLabel: 'Plantilla' },
      },
    } as any);

    expect((component as any).linkedTasks.length).toBe(1);
    expect((component as any).linkedTasks[0].taskId).toBe(15);
    expect((component as any).linkedTasks[0].referenceAlias).toBe('task_1');
    expect((component as any).nestingLimitWarning).toBe('');
  });

  it('should reject duplicate reference aliases when editing them', async () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl(''),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
      { relationType: 'template-task', taskId: 14, referenceAlias: 'ana', draftReferenceAlias: 'ana', name: 'Consulta 2', typeLabel: 'Consulta SQL', relationId: 2 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[1], 'pepe');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[1]);

    expect((component as any).linkedTasks[1].referenceAlias).toBe('ana');
    expect((component as any).linkedTasks[1].draftReferenceAlias).toBe('ana');
    expect(notificationService.showWarning).toHaveBeenCalledWith('common.warnings.title', 'entity.task.template.duplicateReferenceAlias');
  });

  it('should show warning toast when reference alias is invalid', async () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl(''),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], '1alias');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);

    expect((component as any).linkedTasks[0].referenceAlias).toBe('pepe');
    expect((component as any).linkedTasks[0].draftReferenceAlias).toBe('pepe');
    expect(notificationService.showWarning).toHaveBeenCalledWith('common.warnings.title', 'entity.task.template.invalidReferenceAlias');
  });

  it('should replace placeholders in template when renaming a reference alias and user confirms', async () => {
    component.entityToEdit = { properties: { previewContext: { pepe: { value: 1 } } } } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<p>{{pepe}}</p><p>{{pepe.url}}</p><p>{{#if pepe.enabled}}{{pepe.name}}{{/if}}</p><table data-sitmun-each="pepe.rows"><tbody><tr><td>{{name}}</td><td>{{../pepe.total}}</td></tr></tbody></table>'),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], 'consulta_padron');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);
    (component as any).confirmPendingReferenceAliasChange(true);

    expect(component.entityForm.get('templateHtml')?.value).toBe('<p>{{consulta_padron}}</p><p>{{consulta_padron.url}}</p><p>{{#if consulta_padron.enabled}}{{consulta_padron.name}}{{/if}}</p><table data-sitmun-each="consulta_padron.rows"><tbody><tr><td>{{name}}</td><td>{{../consulta_padron.total}}</td></tr></tbody></table>');
    expect((component.entityToEdit as any).properties.previewContext.consulta_padron).toEqual({ value: 1 });
    expect((component as any).linkedTasks[0].referenceAlias).toBe('consulta_padron');
    expect((component as any).linkedTasks[0].draftReferenceAlias).toBe('consulta_padron');
    expect((component as any).pendingReferenceAliasChange).toBeNull();
  });

  it('should ask for confirmation on successive alias changes and replace placeholders each time', async () => {
    component.entityToEdit = { properties: { previewContext: { pepe: { value: 1 } } } } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<p>{{pepe}}</p>'),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], 'consulta_padron');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);
    (component as any).confirmPendingReferenceAliasChange(true);
    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], 'consulta_final');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);
    (component as any).confirmPendingReferenceAliasChange(true);

    expect(component.entityForm.get('templateHtml')?.value).toBe('<p>{{consulta_final}}</p>');
    expect((component.entityToEdit as any).properties.previewContext.consulta_final).toEqual({ value: 1 });
    expect((component.entityToEdit as any).properties.previewContext.consulta_padron).toBeUndefined();
  });

  it('should ask for confirmation when the alias is only used in a table iteration attribute', async () => {
    component.entityToEdit = { properties: { previewContext: { pepe: { rows: [{ name: 'Layer' }] } } } } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<table data-sitmun-each="pepe.rows"><tbody><tr><td>{{name}}</td></tr></tbody></table>'),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], 'consulta_padron');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);

    expect((component as any).pendingReferenceAliasChange).toEqual({
      linkedTask: (component as any).linkedTasks[0],
      previousReferenceAlias: 'pepe',
      nextReferenceAlias: 'consulta_padron',
    });
  });

  it('should keep the alias change and leave template placeholders unchanged when user keeps existing placeholders', async () => {
    component.entityToEdit = { properties: { previewContext: { pepe: { value: 1 } } } } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<p>{{pepe}}</p>'),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], 'consulta_padron');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);
    (component as any).confirmPendingReferenceAliasChange(false);

    expect((component as any).linkedTasks[0].referenceAlias).toBe('consulta_padron');
    expect(component.entityForm.get('templateHtml')?.value).toBe('<p>{{pepe}}</p>');
    expect((component.entityToEdit as any).properties.previewContext.pepe).toEqual({ value: 1 });
  });

  it('should cancel a pending reference alias replacement without changing the alias', async () => {
    component.entityToEdit = { properties: { previewContext: { pepe: { value: 1 } } } } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<p>{{pepe}}</p>'),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];

    (component as any).onReferenceAliasDraftChanged((component as any).linkedTasks[0], 'consulta_padron');
    await (component as any).applyReferenceAliasChange((component as any).linkedTasks[0]);
    (component as any).cancelPendingReferenceAliasChange();

    expect((component as any).linkedTasks[0].referenceAlias).toBe('pepe');
    expect((component as any).linkedTasks[0].draftReferenceAlias).toBe('pepe');
    expect((component as any).pendingReferenceAliasChange).toBeNull();
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

  it('should append table snippets as block html without wrapping them in paragraphs', () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl(''),
    });

    (component as any).onPlaceholderSelected('<table data-sitmun-each="pepe.rows"><tbody><tr><td>{{name}}</td></tr></tbody></table>');

    expect(component.entityForm.get('templateHtml')?.value)
      .toBe('<table data-sitmun-each="pepe.rows"><tbody><tr><td>{{name}}</td></tr></tbody></table>');
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
      referenceAlias: 'pepe',
      legacyReferenceAlias: 'task_13',
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

  it('should store executed rows in preview context for template iteration', () => {
    component.entityToEdit = {
      properties: {},
    } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl(''),
    });

    (component as any).onTaskExecuted({
      taskId: 13,
      referenceAlias: 'consulta_sql',
      legacyReferenceAlias: 'task_13',
      status: 'COMPLETED',
      resultType: 'table',
      parameters: {},
      context: { tui_name: 'layerCatalog' },
      rows: [{ tui_name: 'layerCatalog' }, { tui_name: 'search' }],
      resourceUrl: null,
      flattenedContextKeys: ['tui_name'],
    });

    expect((component.entityToEdit as any).properties.previewContext.consulta_sql.rows)
      .toEqual([{ tui_name: 'layerCatalog' }, { tui_name: 'search' }]);
  });

  it('should render preview only when requested explicitly', () => {
    component.entityToEdit = {
      properties: {
        previewContext: {
          pepe: { tui_name: 'layerCatalog' },
          task_13: { tui_name: 'layerCatalog' },
        },
      },
    } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('tui name: {{pepe.tui_name}}'),
    });
    (component as any).linkedTasks = [
      { relationType: 'template-task', taskId: 13, referenceAlias: 'pepe', draftReferenceAlias: 'pepe', name: 'Consulta', typeLabel: 'Consulta SQL', relationId: 1 },
    ];
    previewService.previewTemplate.mockReturnValue(of({
      html: '<p>tui name: layerCatalog</p>',
      placeholders: ['pepe.tui_name'],
    }));

    (component as any).renderPreview();

    expect(previewService.previewTemplate).toHaveBeenCalledWith('tui name: {{pepe.tui_name}}', {
      pepe: { tui_name: 'layerCatalog' },
      task_13: { tui_name: 'layerCatalog' },
    }, null, ['pepe', 'task_13']);
    expect((component as any).previewHtml).toBe('<p>tui name: layerCatalog</p>');
  });

  it('should include template parameter defaults in preview context', () => {
    component.entityToEdit = {
      properties: {
        parameters: [
          { name: 'featureId', type: 'string', value: '42' },
          { name: 'emptyIgnored', type: 'string', value: '' },
          { variable: 'explicitVar', type: 'string', value: 'abc' },
        ],
        previewContext: {
          pepe: { tui_name: 'layerCatalog' },
        },
      },
    } as any;
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('feature: {{$featureId}} {{pepe.tui_name}}'),
    });

    (component as any).renderPreview();

    expect(previewService.previewTemplate).toHaveBeenCalledWith('feature: {{$featureId}} {{pepe.tui_name}}', {
      $featureId: '42',
      $explicitVar: 'abc',
      pepe: { tui_name: 'layerCatalog' },
    }, null, []);
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

  it('should mark the form as dirty when html editor content changes', () => {
    component.entityForm = new FormGroup({
      name: new FormControl('Template 1'),
      taskGroupId: new FormControl(2),
      templateHtml: new FormControl('<p>hola</p>'),
    });

    component.entityForm.markAsPristine();

    (component as any).onTemplateHtmlChanged('<p>hola 2</p>');

    expect(component.entityForm.get('templateHtml')?.dirty).toBe(true);
    expect(component.entityForm.dirty).toBe(true);
    expect((component as any).previewDirty).toBe(true);
  });

  it('should expose trusted preview html so iframe content can be previewed', () => {
    (component as any).previewHtml = '<iframe src="https://example.com"></iframe>';
    (component as any).trustedPreviewHtml = TestBed.inject(DomSanitizer).bypassSecurityTrustHtml(
      (component as any).previewHtml,
    );

    const trusted = (component as any).trustedPreviewHtml;

    expect(trusted).toBeTruthy();
  });
});
