import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { HalPage } from '@app/core/hal/hal-page';
import type { InfiniteBlockRequest } from '@app/core/hal/infinite-block-request';
import { ResourceHelper } from '@app/core/hal/resource/resource-helper';

import { LiteralTranslationItem } from '@app/components/literal-translations/literal-translation.model';

interface LiteralTranslationPageResponse {
  content: Array<Partial<LiteralTranslationItem>>;
  page: {
    totalElements: number;
    number: number;
    size: number;
    totalPages: number;
  };
}

export interface LiteralTranslationUpsertPayload {
  literal: string;
  translation: string | null;
  language: string;
  sourceLanguage: string;
  translations?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class LiteralTranslationsAdminService {
  private readonly url = `${ResourceHelper.getURL()}literal-translations`;

  constructor(private readonly http: HttpClient) {}

  fetchCompletionPct(language: string): Observable<number> {
    return this.http.get<number>(`${this.url}/${language}/completion`)
  }

  fetchPage(request: InfiniteBlockRequest, language: string): Observable<HalPage<LiteralTranslationItem>> {
    let params = new HttpParams()
      .set('lang', language)
      .set('page', String(request.page))
      .set('size', String(request.size));

    for (const sort of request.sort ?? []) {
      params = params.append('sort', `${sort.path},${sort.order}`);
    }

    return this.http.get<LiteralTranslationPageResponse>(this.url, { headers: ResourceHelper.headers, params }).pipe(
      map((page) => ({
        rows: page.content.map((row) => LiteralTranslationItem.fromObject(row)),
        totalElements: page.page.totalElements,
        pageNumber: page.page.number,
        pageSize: page.page.size,
        totalPages: page.page.totalPages,
      })),
    );
  }

  create(payload: LiteralTranslationUpsertPayload): Observable<LiteralTranslationItem> {
    return this.http.post<Partial<LiteralTranslationItem>>(this.url, payload, { headers: ResourceHelper.headers }).pipe(
      map((item) => LiteralTranslationItem.fromObject(item)),
    );
  }

  update(id: number, payload: LiteralTranslationUpsertPayload): Observable<LiteralTranslationItem> {
    return this.http.put<Partial<LiteralTranslationItem>>(`${this.url}/${id}`, payload, { headers: ResourceHelper.headers }).pipe(
      map((item) => LiteralTranslationItem.fromObject(item)),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { headers: ResourceHelper.headers });
  }
}
