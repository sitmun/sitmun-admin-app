import { Cartography } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { Connection } from '@app/domain/connection/models/connection.model';
import { Service } from '@app/domain/service/models/service.model';
import { LoggerService } from '@app/services/logger.service';

/** Cartography manager service */
@Injectable()
export class CartographyService extends RestService<Cartography> {

  /** API resource path */
  public CARTOGRAPHY_API = 'cartographies';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
    super(Cartography, "cartographies", injector);
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

    /*
    if (item.selectionService != null) {
      cartographySelectionService = item.selectionService
      if (typeof item.selectionService._links != 'undefined') {
        item.selectionService = item.selectionService._links.self.href;
      }
    }
    */

    /*
    if (item.connection != null) {
      cartographyConnection=  item.connection;
      if (typeof item.connection._links != 'undefined') {
        item.connection = item.connection._links.self.href;
      }
    }
     */

    if (item._links != null) {

      //update relations
      /*
      delete item.connection;
       */
      delete item.service;
      /*
      delete item.selectionService;
       */

      // if (cartographyConnection._links.self.href == '' && cartographyConnection) {
      //   item.deleteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
      //   }, error => this.loggerService.error('Error deleting spatial selection connection relation:', error));
      // } else {
      //   item.substituteRelation('spatialSelectionConnection', cartographyConnection).subscribe(result => {
      //   }, error => this.loggerService.error('Error substituting spatial selection connection relation:', error));
      // }

      if (cartographyService._links.self.href == '') {
        item.deleteRelation('service', cartographyService).subscribe(result => {
        }, error => this.loggerService.error('Error deleting service relation:', error));
      } else {
        item.substituteRelation('service', cartographyService).subscribe(result => {
        }, error => this.loggerService.error('Error substituting service relation:', error));
      }

      if (cartographySelectionService._links.self.href == '' && cartographySelectionService) {
        item.deleteRelation('spatialSelectionService', cartographySelectionService).subscribe(result => {
        }, error => this.loggerService.error('Error deleting spatial selection service relation:', error));
      } else {
        item.substituteRelation('spatialSelectionService', cartographySelectionService).subscribe(result => {
        }, error => this.loggerService.error('Error substituting spatial selection service relation:', error));
      }

      result = this.http.put(item._links.self.href, item);

    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_API), item);
    }
    return result;
  }

}
