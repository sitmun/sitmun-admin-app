import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { Translation } from './translation.model';


@Injectable({
  providedIn: 'root'
})
export class TranslationService extends RestService<Translation> {

  /** API resource path */
  public TRANSLATION_API = 'translations';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Translation, "translations", injector);
  }
  
  /** remove translation*/
  remove(item: Translation) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save translation*/
  save(item: Translation): Observable<any> {
    let result: Observable<Object>;

    let language:any = {}
    language._links = {};
    language._links.self = {};
    language._links.self.href = "";

    if (item.language != null) {
      language = item.language;
      if (typeof item.language._links != 'undefined') {
        item.language = item.language._links.self.href;
      } 
    }

    if (item._links!=null) {
      delete item.language;
      // if (language._links.self.href == '') {
      //   item.deleteRelation('language', language).subscribe(result => {
      //   }, error => console.error(error));

      // } else {
      //   item.substituteRelation('language', language).subscribe(result => {
      //   }, error => console.error(error));
      // }
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.TRANSLATION_API) , item);
    }
    return result;
  }
}
