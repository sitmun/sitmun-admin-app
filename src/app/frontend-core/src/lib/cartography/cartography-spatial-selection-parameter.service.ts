import { CartographyParameter } from './cartography-parameter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Service parameter manager service */
@Injectable() 
export class CartographySpatialSelectionParameterService extends RestService<CartographyParameter> {

  /** API resource path */
  public CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API = 'cartography-spatial-selection-parameters';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(CartographyParameter, "cartography-spatial-selection-parameters", injector);
  }
  
  /** remove service parameter*/
  remove(item: CartographyParameter) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save service parameter*/
  save(item: CartographyParameter): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      
      
      if (item.cartography !=null){
          let cartography =  item.cartography;
          delete item.cartography;
          item.substituteRelation('cartography',cartography).subscribe(result => {            
          
      }, error => console.error(error));
      }
      result = this.http.put(item._links.self.href, item);
      
      
    } else {
      item.cartography = item.cartography._links.self.href;
  
      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API) , item);
    }
    return result;
  }
  
}
