import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

import {
  TaskProjection,
  TaskPropertiesContract,
  TaskTemplatePreviewService,
  TemplateTaskExecutionEvent,
  TemplateTaskExecutionResponse,
} from '@app/domain';
import { magic } from '@environments/constants';

type ExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface TemplateChildTaskLink {
  task: TaskProjection;
  referenceAlias: string;
}

@Component({
  selector: 'app-query-execution-card',
  templateUrl: './query-execution-card.component.html',
  styleUrl: './query-execution-card.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryExecutionCardComponent implements OnChanges, OnDestroy {
  private static readonly MAX_TEMPLATE_NESTING_LEVEL = 3;

  @Input({ required: true }) task!: TaskProjection;
  @Input() referenceAlias = '';
  @Input({ required: true }) typeLabel = '';
  @Input() templateChildTasks = new Map<number, TemplateChildTaskLink[]>();
  @Input() taskTypeLabelResolver: ((task: TaskProjection) => string) | null = null;
  @Input() nestingLevel = 0;
  @Input() templateRootTaskId: number | null = null;
  @Input() ancestorTaskIds: number[] = [];
  @Output() executed = new EventEmitter<TemplateTaskExecutionEvent>();
  @Output() placeholderSelected = new EventEmitter<string>();

  @ViewChildren('childCard') private readonly childCards?: QueryList<QueryExecutionCardComponent>;

  parameterForm = new FormGroup({});
  status: ExecutionStatus = 'PENDING';
  response: TemplateTaskExecutionResponse | null = null;
  errorMessage: string | null = null;
  trustedRenderedTemplateHtml: SafeHtml = '';
  renderableChildTasks: TemplateChildTaskLink[] = [];
  childAncestorTaskIds: number[] = [];
  childrenReady = false;

  private deferredRenderTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly previewService: TaskTemplatePreviewService,
    private readonly domSanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']?.currentValue) {
      this.parameterForm = this.createParameterForm();
      this.status = 'PENDING';
      this.response = null;
      this.errorMessage = null;
      this.trustedRenderedTemplateHtml = '';
    }
    this.childAncestorTaskIds = this.getChildAncestorTaskIds();
    this.renderableChildTasks = this.getRenderableChildTasks();

    // Defer actual child rendering to break synchronous cascade.
    // Each nesting level renders in a separate browser task.
    this.childrenReady = false;
    this.cancelDeferredRender();
    if (this.renderableChildTasks.length > 0) {
      this.deferredRenderTimer = setTimeout(() => {
        this.deferredRenderTimer = null;
        this.childrenReady = true;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.cancelDeferredRender();
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
    return `{{${this.resolvedReferenceAlias}}}`;
  }

  get showEmbeddedChildChrome(): boolean {
    return this.nestingLevel === 0;
  }

  get taskResultReference(): string | null {
    if (this.response?.resultType === 'template') {
      return `{{${this.resolvedReferenceAlias}.html}}`;
    }
    if (this.response?.resourceUrl) {
      return `{{${this.resolvedReferenceAlias}.url}}`;
    }
    return null;
  }

  get binaryContentReference(): string | null {
    return this.isBinaryResourceResponse && this.response?.context?.['contentUrl']
      ? `{{${this.resolvedReferenceAlias}.contentUrl}}`
      : null;
  }

  get isBinaryResourceResponse(): boolean {
    return this.response?.context?.['binary'] === true || this.response?.binary === true;
  }

  get showResponseTable(): boolean {
    return !this.isBinaryResourceResponse && !!this.response?.rows?.length;
  }

  get showTaskResultReference(): boolean {
    return !!this.taskResultReference && !this.isBinaryResourceResponse;
  }

  get binaryMimeType(): string {
    const contextMimeType = this.response?.context?.['mimeType'];
    return String(contextMimeType ?? this.response?.mimeType ?? '').toLowerCase();
  }

  get resolvedReferenceAlias(): string {
    return this.referenceAlias?.trim() || this.legacyReferenceAlias;
  }

  get legacyReferenceAlias(): string {
    return `task_${this.task?.id}`;
  }

  get isTemplateTask(): boolean {
    return this.task?.typeId === magic.taskTemplateTypeId;
  }

  get childTasks(): TemplateChildTaskLink[] {
    return this.templateChildTasks.get(this.task?.id ?? -1) ?? [];
  }

  trackChildTask(_index: number, childTask: TemplateChildTaskLink): string | number {
    return childTask.task?.id ?? childTask.referenceAlias;
  }

  private getRenderableChildTasks(): TemplateChildTaskLink[] {
    if (!this.isTemplateTask || this.nestingLevel >= QueryExecutionCardComponent.MAX_TEMPLATE_NESTING_LEVEL) {
      return [];
    }

    const currentPathIds = new Set([...this.ancestorTaskIds, this.task?.id].filter((id): id is number => typeof id === 'number'));
    return this.childTasks.filter((childTask) => !currentPathIds.has(childTask.task?.id));
  }

  private getChildAncestorTaskIds(): number[] {
    return typeof this.task?.id === 'number' ? [...this.ancestorTaskIds, this.task.id] : this.ancestorTaskIds;
  }

  private cancelDeferredRender(): void {
    if (this.deferredRenderTimer !== null) {
      clearTimeout(this.deferredRenderTimer);
      this.deferredRenderTimer = null;
    }
  }

  get renderedTemplateHtml(): string {
    const html = this.response?.context?.['html'];
    return typeof html === 'string' ? html : '';
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
    this.cdr.markForCheck();

    try {
      const response = await firstValueFrom(
        this.previewService.executeLinkedTask(
          this.task.id,
          this.buildExecutionParameters(),
          this.resolvedTemplateTaskId,
          this.isTemplateTask ? this.collectChildTaskParameters() : undefined,
        ),
      );

      this.response = response;
      this.trustedRenderedTemplateHtml = this.domSanitizer.bypassSecurityTrustHtml(this.renderedTemplateHtml || '');
      this.status = response.status === 'PENDING' ? 'PENDING' : 'COMPLETED';
      this.executed.emit({
        ...response,
        referenceAlias: this.resolvedReferenceAlias,
        legacyReferenceAlias: this.legacyReferenceAlias,
      });
      this.cdr.markForCheck();
    } catch (error) {
      this.status = 'FAILED';
      this.errorMessage = (error as { error?: { message?: string }, message?: string } | undefined)?.error?.message
        || (error as { message?: string } | undefined)?.message
        || 'Execution failed';
      this.cdr.markForCheck();
    }
  }

  async copyTaskReference(): Promise<void> {
    await this.copyPlaceholder(this.taskReference);
  }

  async copyTaskResultReference(): Promise<void> {
    if (!this.taskResultReference) {
      return;
    }

    await this.copyPlaceholder(this.taskResultReference);
  }

  async copyParameterReference(parameterName: string): Promise<void> {
    await this.copyPlaceholder(`{{${this.resolvedReferenceAlias}.$${parameterName}}}`);
  }

  async copyResponseReference(fieldPath: string): Promise<void> {
    await this.copyPlaceholder(`{{${this.resolvedReferenceAlias}.${fieldPath}}}`);
  }

  async copyResponseColumnTable(column: string): Promise<void> {
    await this.copyPlaceholder(this.buildResponseTableSnippet([column]));
  }

  async copyResponseTable(): Promise<void> {
    await this.copyPlaceholder(this.buildResponseTableSnippet(this.responseColumns));
  }

  async copyRenderedHtml(): Promise<void> {
    if (!this.renderedTemplateHtml) {
      return;
    }

    await navigator.clipboard.writeText(this.renderedTemplateHtml).catch(() => undefined);
  }

  async copyBinaryContentSnippet(): Promise<void> {
    const contentReference = this.binaryContentReference;
    if (!contentReference) {
      return;
    }

    await this.copyPlaceholder(this.buildBinaryContentSnippet(contentReference));
  }

  stringifyFieldPath(value: unknown): string {
    return value == null ? '' : String(value);
  }

  parameterControlName(parameter: Record<string, unknown>): string {
    return String(parameter['variable'] ?? parameter['name'] ?? parameter['label'] ?? '');
  }

  childTaskTypeLabel(task: TaskProjection): string {
    return this.taskTypeLabelResolver ? this.taskTypeLabelResolver(task) : '';
  }

  onChildExecuted(response: TemplateTaskExecutionEvent): void {
    this.executed.emit(response);
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

  private buildResponseTableSnippet(columns: string[]): string {
    const headers = columns.map((column) => `<th>${this.escapeHtml(column)}</th>`).join('');
    const cells = columns.map((column) => `<td>{{${column}}}</td>`).join('');
    return `<table data-sitmun-each="${this.escapeHtml(this.resolvedReferenceAlias)}.rows"><thead><tr>${headers}</tr></thead><tbody><tr>${cells}</tr></tbody></table>`;
  }

  private buildBinaryContentSnippet(contentReference: string): string {
    const label = this.escapeHtml(this.task?.name || 'Contenido binario');
    if (this.binaryMimeType === 'application/pdf') {
      return `<iframe src="${contentReference}" width="100%" height="360" title="${label}"></iframe>`;
    }
    if (this.binaryMimeType.startsWith('image/')) {
      return `<img src="${contentReference}" alt="${label}">`;
    }
    return `<a href="${contentReference}" target="_blank" rel="noopener noreferrer">Descargar contenido</a>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  get resolvedTemplateTaskId(): number | null {
    return this.templateRootTaskId ?? (this.isTemplateTask ? this.task.id : null);
  }

  private collectChildTaskParameters(): Record<string, Record<string, unknown>> {
    const collected: Record<string, Record<string, unknown>> = {};
    const directChildCards =
      this.childCards?.filter((childCard) => childCard.nestingLevel === this.nestingLevel + 1) ?? [];

    directChildCards.forEach((childCard) => {
      const ownParameters = childCard.buildExecutionParameters();
      if (Object.keys(ownParameters).length > 0) {
        collected[String(childCard.task.id)] = ownParameters;
      }

      Object.assign(collected, childCard.collectChildTaskParameters());
    });

    return collected;
  }
}
