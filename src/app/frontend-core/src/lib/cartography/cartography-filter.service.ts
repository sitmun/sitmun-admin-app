import { CartographyFilter } from './cartography-filter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** CartographyFilter manager service */
@Injectable() 
export class CartographyFilterService extends RestService<CartographyFilter> {
  

  /** API resource path */
  public CARTOGRAPHY_FILTER_API = 'cartography-filters';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(CartographyFilter, "cartography-filters", injector);
  }
  
  /** remove cartography filter*/
  remove(item: CartographyFilter) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save cartography availability*/
  save(item: CartographyFilter): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
      if (item.cartography !=null){
          item.substituteRelation('cartography',item.cartography).subscribe(result => {
      }, error => console.error(error));
      }

      if(item.territorialLevel != null && item.territorialLevel != undefined ){
        item.substituteRelation('territorialLevel',item.territorialLevel).subscribe(result => {
        }, error => console.error(error));
      }
     
    } else {
      
      item.cartography = item.cartography._links.self.href;
      item.territorialLevel=item.territorialLevel._links.self.href;
      
      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_FILTER_API) , item);
    }
    return result;
  }
  
}
