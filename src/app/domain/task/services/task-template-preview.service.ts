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
  flattenedContextKeys: string[];
}

export interface TemplatePreviewResponse {
  html: string;
  placeholders: string[];
}

@Injectable({ providedIn: 'root' })
export class TaskTemplatePreviewService {
  constructor(private readonly http: HttpClient) {}

  executeLinkedTask(linkedTaskId: number, parameters: Record<string, unknown>): Observable<TemplateTaskExecutionResponse> {
    const requestContext = new HttpContext().set(SKIP_MESSAGES_INTERCEPTOR, true);

    return this.http.post<TemplateTaskExecutionResponse>(`${environment.apiBaseURL}/api/tasks/template/execute-child`, {
      linkedTaskId,
      parameters,
    }, {
      context: requestContext,
    });
  }

  previewTemplate(templateHtml: string, context: Record<string, unknown>): Observable<TemplatePreviewResponse> {
    const requestContext = new HttpContext().set(SKIP_MESSAGES_INTERCEPTOR, true);

    return this.http.post<TemplatePreviewResponse>(`${environment.apiBaseURL}/api/tasks/template/preview`, {
      templateHtml,
      context,
    }, {
      context: requestContext,
    });
  }
}
