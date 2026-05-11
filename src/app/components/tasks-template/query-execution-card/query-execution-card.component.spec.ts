import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { TaskTemplatePreviewService } from '@app/domain';

import { QueryExecutionCardComponent } from './query-execution-card.component';

describe('QueryExecutionCardComponent', () => {
  let component: QueryExecutionCardComponent;
  let fixture: ComponentFixture<QueryExecutionCardComponent>;
  let previewService: { executeLinkedTask: jest.Mock };
  let clipboardWriteText: ReturnType<typeof jest.spyOn>;

  beforeEach(async () => {
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: jest.fn().mockResolvedValue(undefined) },
        configurable: true,
      });
    }
    clipboardWriteText = jest.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined as never);

    previewService = {
      executeLinkedTask: jest.fn().mockReturnValue(of({
        taskId: 13,
        status: 'COMPLETED',
        resultType: 'table',
        parameters: {},
        context: {},
        rows: [],
        resourceUrl: null,
      })),
    };

    await TestBed.configureTestingModule({
      declarations: [QueryExecutionCardComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, TranslateModule.forRoot()],
      providers: [{ provide: TaskTemplatePreviewService, useValue: previewService }],
    }).compileComponents();

    fixture = TestBed.createComponent(QueryExecutionCardComponent);
    component = fixture.componentInstance;
    component.task = {
      id: 13,
      name: 'Consulta parcelas',
      typeId: 5,
      properties: {
        parameters: [
          { variable: 'param1', label: 'param1', value: 'default-1' },
          { variable: 'param2', label: 'param2' },
        ],
      },
    } as any;
    component.referenceAlias = 'pepe';
    component.typeLabel = 'Consulta SQL';
    component.ngOnChanges({
      task: {
        currentValue: component.task,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    clipboardWriteText.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create one form control per parameter', () => {
    expect(component.parameterForm.contains('param1')).toBe(true);
    expect(component.parameterForm.contains('param2')).toBe(true);
  });

  it('should initialize controls from task parameter defaults', () => {
    expect(component.parameterForm.get('param1')?.value).toBe('default-1');
    expect(component.parameterForm.get('param2')?.value).toBe('');
  });

  it('should omit blank parameters when executing the task', async () => {
    component.parameterForm.get('param1')?.setValue('' as never);
    component.parameterForm.get('param2')?.setValue('  ' as never);

    await component.execute();

    expect(previewService.executeLinkedTask).toHaveBeenCalledWith(13, {}, null, undefined);
  });

  it('should expose translation keys for execution states', () => {
    component.status = 'PENDING';
    expect(component.statusTranslationKey).toBe('entity.task.template.status.pending');

    component.status = 'RUNNING';
    expect(component.statusTranslationKey).toBe('entity.task.template.status.running');

    component.status = 'COMPLETED';
    expect(component.statusTranslationKey).toBe('entity.task.template.status.completed');

    component.status = 'FAILED';
    expect(component.statusTranslationKey).toBe('entity.task.template.status.failed');
  });

  it('should switch to failed state when execution errors', async () => {
    previewService.executeLinkedTask.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Execution failed' } })),
    );

    await component.execute();

    expect(component.status).toBe('FAILED');
    expect(component.errorMessage).toBe('Execution failed');
  });

  it('should copy task reference and emit it for template insertion', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));

    await component.copyTaskReference();

    expect(clipboardWriteText).toHaveBeenCalledWith('{{pepe}}');
    expect(emitted).toEqual(['{{pepe}}']);
  });

  it('should copy parameter reference using real parameter name', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));

    await component.copyParameterReference('param1');

    expect(clipboardWriteText).toHaveBeenCalledWith('{{pepe.$param1}}');
    expect(emitted).toEqual(['{{pepe.$param1}}']);
  });

  it('should copy response field reference', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));

    await component.copyResponseReference('features[42].attributes.name_prov');

    expect(clipboardWriteText).toHaveBeenCalledWith('{{pepe.features[42].attributes.name_prov}}');
    expect(emitted).toEqual(['{{pepe.features[42].attributes.name_prov}}']);
  });

  it('should copy a table snippet for a single response column', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));
    component.response = {
      taskId: 13,
      status: 'COMPLETED',
      resultType: 'table',
      parameters: {},
      context: {},
      rows: [{ tui_tooltip: 'Layer', tui_id: 35 }],
      resourceUrl: null,
    };

    await component.copyResponseColumnTable('tui_tooltip');

    const expected = '<table data-sitmun-each="pepe.rows"><thead><tr><th>tui_tooltip</th></tr></thead><tbody><tr><td>{{tui_tooltip}}</td></tr></tbody></table>';
    expect(clipboardWriteText).toHaveBeenCalledWith(expected);
    expect(emitted).toEqual([expected]);
  });

  it('should copy a table snippet for all response columns', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));
    component.response = {
      taskId: 13,
      status: 'COMPLETED',
      resultType: 'table',
      parameters: {},
      context: {},
      rows: [{ tui_tooltip: 'Layer', tui_id: 35 }],
      resourceUrl: null,
    };

    await component.copyResponseTable();

    const expected = '<table data-sitmun-each="pepe.rows"><thead><tr><th>tui_tooltip</th><th>tui_id</th></tr></thead><tbody><tr><td>{{tui_tooltip}}</td><td>{{tui_id}}</td></tr></tbody></table>';
    expect(clipboardWriteText).toHaveBeenCalledWith(expected);
    expect(emitted).toEqual([expected]);
  });

  it('should expose url result reference after executing a resource/url task', async () => {
    component.response = {
      taskId: 13,
      status: 'COMPLETED',
      resultType: 'url',
      parameters: {},
      context: { url: 'https://example.com' },
      rows: [],
      resourceUrl: 'https://example.com',
    };

    expect(component.taskResultReference).toBe('{{pepe.url}}');
  });

  it('should render nested template html from executed child contexts', async () => {
    component.task = {
      id: 15,
      name: 'Plantilla hija',
      typeId: 15,
        properties: {
          templateHtml: '<p>{{child_url.url}}</p>',
        },
      } as any;
    component.referenceAlias = 'plantilla_hija';
    component.templateChildTasks = new Map([
      [15, [{ task: { id: 13, name: 'URL hija', typeId: 5, properties: {} } as any, referenceAlias: 'child_url' }]],
    ]);
    previewService.executeLinkedTask.mockReturnValueOnce(of({
      taskId: 15,
      status: 'COMPLETED',
      resultType: 'template',
      parameters: {},
      context: { html: '<p>Rendered</p>' },
      rows: [],
      resourceUrl: null,
    }));
    component.ngOnChanges({
      task: {
        currentValue: component.task,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    await component.execute();

    expect(previewService.executeLinkedTask).toHaveBeenCalledWith(15, {}, 15, {});
    expect(component.response?.context['html']).toBe('<p>Rendered</p>');
    expect(component.taskResultReference).toBe('{{plantilla_hija.html}}');
  });

  it('should hide chrome for nested template child cards', () => {
    component.nestingLevel = 1;

    expect(component.showEmbeddedChildChrome).toBe(false);
  });
});
