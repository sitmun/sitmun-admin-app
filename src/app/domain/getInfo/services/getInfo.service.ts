import {Injectable, Injector} from '@angular/core';
import {RestService} from '@app/core/hal/rest/rest.service';
import {Info} from '@app/domain';
import {EMPTY, Observable} from "rxjs";
import {HttpHeaders, HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class GetInfoService extends RestService<Info> {

  /** API resource path */
  public INFO_API = 'helpers/feature-type?url=';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient) {
    super(Info, "helpers/feature-type?url=", injector);
  }

  /** save service*/
  getInfo(url: string): Observable<unknown> {
    if (url) {
      const headerDict = {
        'Charset': 'UTF-8'
      }
      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      let finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
      finalUrl = finalUrl.concat(url);

      return this.http.get(finalUrl, requestOptions);
    }
    return EMPTY;
  }

}
