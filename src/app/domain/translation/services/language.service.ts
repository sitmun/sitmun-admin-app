import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';
import { Language } from '@app/domain';


@Injectable({
  providedIn: 'root'
})
export class LanguageService extends RestService<Language> {

  /** constructor */
  constructor(injector: Injector) {
    super(Language, "languages", injector);
  }
}
