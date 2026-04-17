import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SKIP_MESSAGES_INTERCEPTOR } from '@app/core/interceptors/messages.interceptor';

import { TaskTemplatePreviewService } from './task-template-preview.service';

describe('TaskTemplatePreviewService', () => {
  let service: TaskTemplatePreviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskTemplatePreviewService],
    });

    service = TestBed.inject(TaskTemplatePreviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should skip global message interception for template preview requests', () => {
    service.previewTemplate('<p>{{task_13.name}}</p>', { task_13: { name: 'Layer' } }).subscribe();

    const req = httpMock.expectOne((request) => request.url.endsWith('/api/tasks/template/preview'));

    expect(req.request.context.get(SKIP_MESSAGES_INTERCEPTOR)).toBe(true);

    req.flush({ html: '<p>Layer</p>', placeholders: ['task_13.name'] });
  });

  it('should skip global message interception for execute child requests', () => {
    service.executeLinkedTask(13, { where: '1=1' }).subscribe();

    const req = httpMock.expectOne((request) => request.url.endsWith('/api/tasks/template/execute-child'));

    expect(req.request.context.get(SKIP_MESSAGES_INTERCEPTOR)).toBe(true);

    req.flush({
      taskId: 13,
      status: 'COMPLETED',
      resultType: 'table',
      parameters: { where: '1=1' },
      context: {},
      rows: [],
      resourceUrl: null,
      flattenedContextKeys: [],
    });
  });
});
