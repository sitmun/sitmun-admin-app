import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
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
        { id: 7, literal: 'Hola mon', translation: 'Hola mundo', sourceLanguage: 'ca' },
        { id: 8, literal: 'Adios', translation: 'Adios', sourceLanguage: 'es' },
      ],
      page: {
        totalElements: 123,
        number: 2,
        size: 50,
        totalPages: 3,
      },
    });
  });

  it('sends source language in create payloads', () => {
    service.create({
      literal: 'Hola mon',
      translation: 'Hola mundo',
      language: 'es',
      sourceLanguage: 'ca',
    }).subscribe();

    const req = httpMock.expectOne((request) => request.url.includes('literal-translations') && request.method === 'POST');

    expect(req.request.body).toEqual({
      literal: 'Hola mon',
      translation: 'Hola mundo',
      language: 'es',
      sourceLanguage: 'ca',
    });

    req.flush({ id: 9, literal: 'Hola mon', translation: 'Hola mundo', sourceLanguage: 'ca', complete: false });
  });

  it('exports csv with the selected ids and filename', () => {
    service.exportCsv({
      targetLanguage: 'es',
      literalIds: [7, 8],
      fileName: 'literal-translations-es-partial.csv',
    }).subscribe((response) => {
      expect(response.body).toBeInstanceOf(Blob);
      expect(response.headers.get('content-disposition')).toContain('literal-translations-es.csv');
    });

    const req = httpMock.expectOne((request) => request.url.includes('literal-translations/csv/export') && request.method === 'POST');

    expect(req.request.responseType).toBe('blob');
    expect(req.request.body).toEqual({
      targetLanguage: 'es',
      literalIds: [7, 8],
      fileName: 'literal-translations-es-partial.csv',
    });

    req.flush(new Blob(['literal,translation']), {
      headers: new HttpHeaders({ 'content-disposition': "attachment; filename*=UTF-8''literal-translations-es.csv" }),
      status: 200,
      statusText: 'OK',
    });
  });

  it('imports csv as multipart form data', () => {
    const file = new File(['source_language,literal,translation'], 'literal-translations-es.csv', { type: 'text/csv' });

    service.importCsv('es', file).subscribe((response) => {
      expect(response.targetLanguage).toBe('es');
      expect(response.totalRows).toBe(1);
      expect(response.failedRows).toBe(0);
      expect(response.errors).toEqual([]);
    });

    const req = httpMock.expectOne((request) => request.url.includes('literal-translations/csv/import') && request.method === 'POST');
    const body = req.request.body as FormData;
    const fileField = body.get('file') as File | null;

    expect(body.get('targetLanguage')).toBe('es');
    expect(fileField).toBeInstanceOf(File);
    expect(fileField?.name).toBe(file.name);
    expect(fileField?.type).toBe(file.type);

    req.flush({
      targetLanguage: 'es',
      totalRows: 1,
      createdLiterals: 0,
      createdTranslations: 0,
      updatedTranslations: 1,
      emptiedTranslations: 0,
      unchangedRows: 0,
      existingKeysNotInCsv: 0,
      emptyValueRows: 0,
      failedRows: 0,
      sourceLanguages: ['ca'],
      errors: [],
    });
  });
});
