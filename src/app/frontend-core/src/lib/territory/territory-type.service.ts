import { Territory } from './territory.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { TerritoryType } from './territory-type.model';

/** TerritoryType manager service */
@Injectable()
export class TerritoryTypeService extends RestService<TerritoryType> {
  

  /** API resource path */
  public TERRITORYTYPE_API = 'territory-types';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(TerritoryType, "territory-types", injector);
  }
  
  /** remove territory type*/
  remove(item: TerritoryType) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save territory type*/
  save(item: any): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYTYPE_API) , item);
    }
    return result;
  }
  
}
