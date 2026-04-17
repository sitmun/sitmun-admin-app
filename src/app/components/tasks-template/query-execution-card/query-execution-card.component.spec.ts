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
      flattenedContextKeys: [],
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

    expect(previewService.executeLinkedTask).toHaveBeenCalledWith(13, {});
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

    expect(clipboardWriteText).toHaveBeenCalledWith('{{task_13}}');
    expect(emitted).toEqual(['{{task_13}}']);
  });

  it('should copy parameter reference using real parameter name', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));

    await component.copyParameterReference('param1');

    expect(clipboardWriteText).toHaveBeenCalledWith('{{task_13.$param1}}');
    expect(emitted).toEqual(['{{task_13.$param1}}']);
  });

  it('should copy response field reference', async () => {
    const emitted: string[] = [];
    component.placeholderSelected.subscribe((value) => emitted.push(value));

    await component.copyResponseReference('features[42].attributes.name_prov');

    expect(clipboardWriteText).toHaveBeenCalledWith('{{task_13.features[42].attributes.name_prov}}');
    expect(emitted).toEqual(['{{task_13.features[42].attributes.name_prov}}']);
  });
});
