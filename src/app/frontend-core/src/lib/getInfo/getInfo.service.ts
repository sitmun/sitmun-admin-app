import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';


@Injectable({
  providedIn: 'root'
})
export class GetInfoService extends RestService<Info>  {

  /** API resource path */
  public INFO_API = 'helpers/feature-type?url=';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Info, "helpers/feature-type?url=", injector);
  }

    /** save service*/
    getInfo(url: string): Observable<any> {
      let result: Observable<Object>;
      if(url){
        const headerDict = {
          'Charset': 'UTF-8'
        }
        
        const requestOptions = {                                                                                                                                                                                 
          headers: new HttpHeaders(headerDict), 
        };
        let finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
        finalUrl = finalUrl.concat(url);
        console.log(finalUrl);
        result = this.http.get(finalUrl, requestOptions);
      }
      return result;
 
    }
  
}