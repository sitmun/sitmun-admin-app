import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LiteralTranslationsAdminService } from './literal-translations-admin.service';

describe('LiteralTranslationsAdminService', () => {
  let service: LiteralTranslationsAdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LiteralTranslationsAdminService],
    });

    service = TestBed.inject(LiteralTranslationsAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps paged model responses to hal pages', () => {
    service.fetchPage({ page: 2, size: 50, sort: [{ path: 'literal', order: 'ASC' }] }, 'es').subscribe((page) => {
      expect(page.rows).toHaveLength(2);
      expect(page.rows[0].id).toBe(7);
      expect(page.totalElements).toBe(123);
      expect(page.pageNumber).toBe(2);
      expect(page.pageSize).toBe(50);
      expect(page.totalPages).toBe(3);
    });

    const req = httpMock.expectOne((request) => request.url.includes('literal-translations'));

    expect(req.request.params.get('lang')).toBe('es');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('50');
    expect(req.request.params.getAll('sort')).toEqual(['literal,ASC']);

    req.flush({
      content: [
        { id: 7, literal: 'Hola mon', translation: 'Hola mundo' },
        { id: 8, literal: 'Adios', translation: 'Adios' },
      ],
      page: {
        totalElements: 123,
        number: 2,
        size: 50,
        totalPages: 3,
      },
    });
  });
});
