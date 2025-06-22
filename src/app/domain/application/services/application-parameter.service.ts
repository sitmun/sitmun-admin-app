import { ApplicationParameter } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

/** Application parameter manager service */
@Injectable()
export class ApplicationParameterService extends RestService<ApplicationParameter> {


  /** API resource path */
  public APPLICATION_PARAMETER_API = 'application-parameters';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
    super(ApplicationParameter, "application-parameters", injector);
  }

  /** save application*/
  save(item: ApplicationParameter): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
      if (item.application !=null){
          item.substituteRelation('application',item.application).subscribe(result => {

      }, error => this.loggerService.error('Error substituting application relation:', error));
      }

    } else {
      item.application = item.application._links.self.href;

      result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_PARAMETER_API) , item);
    }
    return result;
  }

}
