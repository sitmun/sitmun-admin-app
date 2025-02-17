import { ApplicationParameter } from './application-parameter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Application parameter manager service */
@Injectable() 
export class ApplicationParameterService extends RestService<ApplicationParameter> {
  

  /** API resource path */
  public APPLICATION_PARAMETER_API = 'application-parameters';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(ApplicationParameter, "application-parameters", injector);
  }
  
  /** remove application*/
  remove(item: ApplicationParameter) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save application*/
  save(item: ApplicationParameter): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
      if (item.application !=null){
          item.substituteRelation('application',item.application).subscribe(result => {
      
      }, error => console.error(error));
      }
      
    } else {
      item.application = item.application._links.self.href;
  
      result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_PARAMETER_API) , item);
    }
    return result;
  }
  
}
