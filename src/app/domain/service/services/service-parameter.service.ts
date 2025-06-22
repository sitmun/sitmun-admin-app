import { ServiceParameter } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

/** Service parameter manager service */
@Injectable()
export class ServiceParameterService extends RestService<ServiceParameter> {

  /** API resource path */
  public SERVICE_PARAMETER_API = 'service-parameters';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
    super(ServiceParameter, "service-parameters", injector);
  }

  /** save service parameter*/
  save(item: ServiceParameter, requestTypes: any[]): Observable<any> {
    let result: Observable<Object>;

    item.type = requestTypes.find(
      element => element.description == item.type
    ).value;

    if (item._links!=null) {


      if (item.service !=null){
          let service =  item.service;
          delete item.service;
          item.substituteRelation('service',service).subscribe(result => {

      }, error => this.loggerService.error('Error substituting service relation:', error));
      }
      result = this.http.put(item._links.self.href, item);


    } else {
      item.service = item.service._links.self.href;

      result = this.http.post(this.resourceService.getResourceUrl(this.SERVICE_PARAMETER_API) , item);
    }
    return result;
  }

}
