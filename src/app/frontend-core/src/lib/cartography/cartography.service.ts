import { Cartography } from './cartography.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Connection } from '../connection/connection.model';
import { Service } from '../service/service.model';

/** Cartography manager service */
@Injectable()
export class CartographyService extends RestService<Cartography> {

  /** API resource path */
  public CARTOGRAPHY_API = 'cartographies';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient) {
    super(Cartography, "cartographies", injector);
  }

  /** remove cartography*/
  remove(item: Cartography) {
    return this.http.delete(item._links.self.href);

  }

  /** save cartography*/
  save(item: Cartography): Observable<any> {
    let result: Observable<Object>;

    let cartographyConnection:any={};
    cartographyConnection._links = {};
    cartographyConnection._links.self = {};
    cartographyConnection._links.self.href = "";
     
    let cartographyService:any={};
    cartographyService._links = {};
    cartographyService._links.self = {};
    cartographyService._links.self.href = "";
    
    let cartographySelectionService:any = {};
    cartographySelectionService._links = {};
    cartographySelectionService._links.self = {};
    cartographySelectionService._links.self.href = "";

    if (item.service != null) {
      cartographyService=  item.service;
      if (typeof item.service._links != 'undefined') {
        item.service = item.service._links.self.href;
      }
    }

    if (item.selectionService != null) {
      cartographySelectionService = item.selectionService
      if (typeof item.selectionService._links != 'undefined') {
        item.selectionService = item.selectionService._links.self.href;
      }
    }

    if (item.connection != null) {
      cartographyConnection=  item.connection;
      if (typeof item.connection._links != 'undefined') {
        item.connection = item.connection._links.self.href;
      }
    }

    if (item._links != null) {

      //update relations
      delete item.connection;
      delete item.service;
      delete item.selectionService;

      // if (cartographyConnection._links.self.href == '' && cartographyConnection) {
      //   item.deleteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
      //   }, error => console.error(error));
      // } else {
      //   item.substituteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
      //   }, error => console.error(error));
      // }

      if (cartographyService._links.self.href == '') {
        item.deleteRelation('service', cartographyService).subscribe(result => {
        }, error => console.error(error));
      } else {
        item.substituteRelation('service', cartographyService).subscribe(result => {
        }, error => console.error(error));
      }

      if (cartographySelectionService._links.self.href == '' && cartographySelectionService) {
        item.deleteRelation('spatialSelectionService', cartographySelectionService).subscribe(result => {
        }, error => console.error(error));
      } else {
        item.substituteRelation('spatialSelectionService', cartographySelectionService).subscribe(result => {
        }, error => console.error(error));
      }

      result = this.http.put(item._links.self.href, item);

    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_API), item);
    }
    return result;
  }

}
