import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';

import { Translation } from '../models/translation.model';


@Injectable({
  providedIn: 'root'
})
export class TranslationService extends RestService<Translation> {

  /** API resource path */
  public TRANSLATION_API = 'translations';

  /** constructor */
  constructor(injector: Injector) {
    super(Translation, "translations", injector);
  }

  /** save translation*/
  save(item: Translation): Observable<any> {
    let result: Observable<object>;

    if (ResourceHelper.canBeUpdated(item)) {
      delete item.language;
      result = this.update(item);
    } else {
      result = this.create(item);
    }
    return result;
  }
}
