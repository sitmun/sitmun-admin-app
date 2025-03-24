import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { Language } from '@app/domain';


@Injectable({
  providedIn: 'root'
})
export class LanguageService extends RestService<Language> {

  /** API resource path */
  public LANGUAGES_API = 'languages';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Language, "languages", injector);
  }

  /** save translation*/
  save(item: Language): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.LANGUAGES_API) , item);
    }
    return result;
  }
}
