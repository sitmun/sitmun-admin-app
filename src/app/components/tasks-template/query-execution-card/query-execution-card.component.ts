import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TaskProjection, TaskPropertiesContract, TaskTemplatePreviewService, TemplateTaskExecutionResponse } from '@app/domain';

type ExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

@Component({
  selector: 'app-query-execution-card',
  templateUrl: './query-execution-card.component.html',
  styleUrl: './query-execution-card.component.scss',
  standalone: false,
})
export class QueryExecutionCardComponent implements OnChanges {
  @Input({ required: true }) task!: TaskProjection;
  @Input({ required: true }) typeLabel = '';
  @Output() executed = new EventEmitter<TemplateTaskExecutionResponse>();
  @Output() placeholderSelected = new EventEmitter<string>();

  parameterForm = new FormGroup({});
  status: ExecutionStatus = 'PENDING';
  response: TemplateTaskExecutionResponse | null = null;
  errorMessage: string | null = null;

  constructor(private readonly previewService: TaskTemplatePreviewService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.currentValue) {
      this.parameterForm = this.createParameterForm();
      this.status = 'PENDING';
      this.response = null;
      this.errorMessage = null;
    }
  }

  get parameterDefinitions(): Array<Record<string, unknown>> {
    return TaskPropertiesContract.getParameters(this.task?.properties);
  }

  get statusTranslationKey(): string {
    switch (this.status) {
      case 'RUNNING':
        return 'entity.task.template.status.running';
      case 'COMPLETED':
        return 'entity.task.template.status.completed';
      case 'FAILED':
        return 'entity.task.template.status.failed';
      case 'PENDING':
      default:
        return 'entity.task.template.status.pending';
    }
  }

  get taskReference(): string {
    return `{{task_${this.task?.id}}}`;
  }

  get responseColumns(): string[] {
    if (!this.response?.rows?.length || this.isFieldValueTable) {
      return [];
    }
    return Object.keys(this.response.rows[0]);
  }

  get isFieldValueTable(): boolean {
    if (!this.response?.rows?.length) {
      return false;
    }
    const columns = Object.keys(this.response.rows[0]);
    return columns.length === 2 && columns.includes('field') && columns.includes('value');
  }

  async execute(): Promise<void> {
    if (!this.task?.id) {
      return;
    }

    this.status = 'RUNNING';
    this.errorMessage = null;

    this.previewService.executeLinkedTask(this.task.id, this.buildExecutionParameters()).subscribe({
      next: (response) => {
        this.response = response;
        this.status = response.status === 'PENDING' ? 'PENDING' : 'COMPLETED';
        this.executed.emit(response);
      },
      error: (error) => {
        this.status = 'FAILED';
        this.errorMessage = error?.error?.message || error?.message || 'Execution failed';
      },
    });
  }

  async copyTaskReference(): Promise<void> {
    await this.copyPlaceholder(this.taskReference);
  }

  async copyParameterReference(parameterName: string): Promise<void> {
    await this.copyPlaceholder(`{{task_${this.task.id}.$${parameterName}}}`);
  }

  async copyResponseReference(fieldPath: string): Promise<void> {
    await this.copyPlaceholder(`{{task_${this.task.id}.${fieldPath}}}`);
  }

  stringifyFieldPath(value: unknown): string {
    return value == null ? '' : String(value);
  }

  parameterControlName(parameter: Record<string, unknown>): string {
    return String(parameter['variable'] ?? parameter['name'] ?? parameter['label'] ?? '');
  }

  private createParameterForm(): FormGroup {
    const group = new FormGroup({});
    this.parameterDefinitions.forEach((parameter) => {
      const controlName = this.parameterControlName(parameter);
      if (controlName) {
        group.addControl(controlName, new FormControl(this.parameterInitialValue(parameter)));
      }
    });
    return group;
  }

  private parameterInitialValue(parameter: Record<string, unknown>): string {
    const value = parameter['value'];
    return typeof value === 'string' ? value : '';
  }

  private buildExecutionParameters(): Record<string, unknown> {
    return Object.entries(this.parameterForm.getRawValue()).reduce<Record<string, unknown>>((parameters, [key, value]) => {
      if (typeof value === 'string') {
        if (!value.trim()) {
          return parameters;
        }
        parameters[key] = value;
        return parameters;
      }

      if (value !== null && value !== undefined) {
        parameters[key] = value;
      }

      return parameters;
    }, {});
  }

  private async copyPlaceholder(placeholder: string): Promise<void> {
    await navigator.clipboard.writeText(placeholder).catch(() => undefined);
    this.placeholderSelected.emit(placeholder);
  }
}
