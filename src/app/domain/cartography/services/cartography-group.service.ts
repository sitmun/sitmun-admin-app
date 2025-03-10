import { CartographyGroup } from '../models/cartography-group.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal';

/** CartographyGroup manager service */
@Injectable()
export class CartographyGroupService extends RestService<CartographyGroup> {
  

  /** API resource path */
  public CARTOGRAPHY_GROUP_API ='cartography-groups';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(CartographyGroup, "cartography-groups", injector);
  }
  
  /** remove cartography group*/
  remove(item: CartographyGroup) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save cartography group*/
  save(item: CartographyGroup): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_GROUP_API) , item);
    }
    return result;
  }
  
}
