import { Service } from './service.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Service manager service */
@Injectable()
export class ServiceService extends RestService<Service> {

  /** API resource path */
  public SERVICE_API = 'services';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Service, "services", injector);
  }
  
  /** remove service*/
  remove(item: Service) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save service*/
  save(item: Service): Observable<any> {
    let result: Observable<Object>;
    let serviceConnection = item.connection;

    if (item.connection!=null){
        if (typeof item.connection._links!= 'undefined') { 
            item.connection = item.connection._links.self.href;
        } else {
            serviceConnection._links= {};
            serviceConnection._links.self = {};
            serviceConnection._links.self.href="";
        }        
     }

    if (item._links!=null) {     
      result = this.http.put(item._links.self.href, item);       
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_API) , item);
    }
    return result;
  }
  
}
