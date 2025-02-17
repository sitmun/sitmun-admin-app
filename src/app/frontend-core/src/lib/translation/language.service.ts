import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { Language } from './language.model';


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
  
  /** remove translation*/
  remove(item: Language) {
    return this.http.delete(item._links.self.href);
   
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
