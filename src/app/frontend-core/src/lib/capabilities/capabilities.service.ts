import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { Capabilitie } from './capabilitie.model';


@Injectable({
  providedIn: 'root'
})
export class CapabilitiesService extends RestService<Capabilitie>  {

  /** API resource path */
  public CAPABILITIES_API = 'helpers/capabilities?url=';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Capabilitie, "helpers/capabilities?url=", injector);
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
        let finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
        finalUrl = finalUrl.concat(url);
        console.log(finalUrl);
        result = this.http.get(finalUrl, requestOptions);
      }
      return result;
 
    }
  
}
