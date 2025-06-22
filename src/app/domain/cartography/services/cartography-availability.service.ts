import { CartographyAvailability } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

/** CartographyAvailability manager service */
@Injectable()
export class CartographyAvailabilityService extends RestService<CartographyAvailability> {


  /** API resource path */
  public CARTOGRAPHY_AVAILABILITY_API = 'cartography-availabilities';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
    super(CartographyAvailability, "cartography-availabilities", injector);
  }

  /** save cartography availability*/
  save(item: CartographyAvailability): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
      if (item.cartography !=null){
          item.substituteRelation('cartography',item.cartography).subscribe(result => {

      }, error => this.loggerService.error('Error substituting cartography relation:', error));
      }
      if (item.territory !=null){
          item.substituteRelation('territory',item.territory).subscribe(result => {

      }, error => this.loggerService.error('Error substituting territory relation:', error));
      }
    } else {
      item.territory = item.territory._links.self.href;
      item.cartography = item.cartography._links.self.href;

      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_AVAILABILITY_API) , item);
    }
    return result;
  }

}
