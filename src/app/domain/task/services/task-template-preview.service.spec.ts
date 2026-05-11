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
    service.previewTemplate('<p>{{pepe.name}}</p>', { pepe: { name: 'Layer' } }, 15, ['pepe', 'task_13']).subscribe();

    const req = httpMock.expectOne((request) => request.url.endsWith('/api/tasks/template/preview'));

    expect(req.request.context.get(SKIP_MESSAGES_INTERCEPTOR)).toBe(true);
    expect(req.request.body).toEqual({
      templateTaskId: 15,
      templateHtml: '<p>{{pepe.name}}</p>',
      context: { pepe: { name: 'Layer' } },
      knownTaskReferences: ['pepe', 'task_13'],
    });

    req.flush({ html: '<p>Layer</p>', placeholders: ['pepe.name'] });
  });

  it('should skip global message interception for execute child requests', () => {
    service.executeLinkedTask(13, { where: '1=1' }, 15, { '27': { param: 'x' } }).subscribe();

    const req = httpMock.expectOne((request) => request.url.endsWith('/api/tasks/template/execute-child'));

    expect(req.request.context.get(SKIP_MESSAGES_INTERCEPTOR)).toBe(true);
    expect(req.request.body).toEqual({
      templateTaskId: 15,
      linkedTaskId: 13,
      parameters: { where: '1=1' },
      childTaskParameters: { '27': { param: 'x' } },
    });

    req.flush({
      taskId: 13,
      status: 'COMPLETED',
      resultType: 'table',
      parameters: { where: '1=1' },
      context: {},
      rows: [],
      resourceUrl: null,
    });
  });
});
