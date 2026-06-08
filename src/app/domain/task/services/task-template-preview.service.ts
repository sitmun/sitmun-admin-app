import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { SKIP_MESSAGES_INTERCEPTOR } from '@app/core/interceptors/messages.interceptor';
import { environment } from '@environments/environment';

export interface TemplateTaskExecutionResponse {
  taskId: number;
  status: string;
  resultType: string;
  parameters: Record<string, unknown>;
  context: Record<string, unknown>;
  rows: Record<string, unknown>[];
  resourceUrl: string | null;
  mimeType?: string | null;
  binary?: boolean;
}

export interface TemplateTaskExecutionEvent extends TemplateTaskExecutionResponse {
  referenceAlias: string;
  legacyReferenceAlias: string;
}

export interface TemplatePreviewResponse {
  html: string;
  placeholders: string[];
}

@Injectable({ providedIn: 'root' })
export class TaskTemplatePreviewService {
  constructor(private readonly http: HttpClient) {}

  executeLinkedTask(
    linkedTaskId: number,
    parameters: Record<string, unknown>,
    templateTaskId?: number | null,
    childTaskParameters?: Record<string, Record<string, unknown>>,
  ): Observable<TemplateTaskExecutionResponse> {
    const requestContext = new HttpContext().set(SKIP_MESSAGES_INTERCEPTOR, true);

    return this.http.post<TemplateTaskExecutionResponse>(`${environment.apiBaseURL}/api/tasks/template/execute-child`, {
      templateTaskId: templateTaskId ?? null,
      linkedTaskId,
      parameters,
      childTaskParameters: childTaskParameters ?? null,
    }, {
      context: requestContext,
    });
  }

  previewTemplate(
    templateHtml: string,
    context: Record<string, unknown>,
    templateTaskId?: number | null,
    knownTaskReferences?: string[],
  ): Observable<TemplatePreviewResponse> {
    const requestContext = new HttpContext().set(SKIP_MESSAGES_INTERCEPTOR, true);

    return this.http.post<TemplatePreviewResponse>(`${environment.apiBaseURL}/api/tasks/template/preview`, {
      templateTaskId: templateTaskId ?? null,
      templateHtml,
      context,
      knownTaskReferences: knownTaskReferences ?? [],
    }, {
      context: requestContext,
    });
  }
}
