import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { SubTypeBuilder } from '@app/core/hal/common/subtype-builder';
import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { HalOptions , RestService } from '@app/core/hal/rest/rest.service';
import { Sort } from '@app/core/hal/rest/sort.model';

import { Language } from '@app/domain';


@Injectable({
  providedIn: 'root'
})
export class LanguageService extends RestService<Language> {
  private readonly http: HttpClient;
  private readonly url = `${ResourceHelper.getURL()}languages`;

  /** constructor */
  constructor(injector: Injector) {
    super(Language, "languages", injector);
    this.http = injector.get(HttpClient);
  }

  override fetchAllItems(
    options?: HalOptions,
    subType?: SubTypeBuilder,
    embeddedName?: string,
    ignoreProjection?: boolean,
  ): Observable<Language[]> {
    const sort = [new Sort('order', 'ASC'), new Sort('id', 'ASC')];
    return super.fetchAllItems({ ...options, sort }, subType, embeddedName, ignoreProjection);
  }

  reorder(payload: number[]): Observable<void> {
    return this.http.post<void>(`${this.url}/reorder`, payload, { headers: ResourceHelper.headers });
  }

  setDefault(languageId: number): Observable<void> {
    return this.http.post<void>(`${this.url}/${languageId}/default`, {}, { headers: ResourceHelper.headers });
  }
}
