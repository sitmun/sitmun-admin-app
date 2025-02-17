import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { CartographyStyle } from './cartography-style.model';

@Injectable({
  providedIn: 'root'
})
export class CartographyStyleService extends RestService<CartographyStyle> {

 /** API resource path */
  public CARTOGRAPHY_STYLES_API = 'cartography-styles';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(CartographyStyle, "cartography-styles", injector);
  }
  
  /** remove service parameter*/
  remove(item: CartographyStyle) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save service parameter*/
  save(item: CartographyStyle): Observable<any> {
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
  
      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_STYLES_API) , item);
    }
    return result;
  }
  
}
