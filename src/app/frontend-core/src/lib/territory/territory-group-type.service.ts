import { TerritoryGroupType } from './territory-group-type.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
@Injectable({
  providedIn: 'root'
})
export class TerritoryGroupTypeService extends RestService<TerritoryGroupType> {
  
  /** API resource path */
  public TERRITORYGROUPTYPE_API = 'territory-group-types';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(TerritoryGroupType, "territory-group-types", injector);
  }
  
  /** remove territory*/
  remove(item: TerritoryGroupType) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save territory*/
  save(item: any): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYGROUPTYPE_API) , item);
    }
    return result;
  }
  
}