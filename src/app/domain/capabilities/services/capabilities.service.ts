import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {RestService} from '@app/core/hal/rest/rest.service';
import {Capabilities} from '@app/domain';

/**
 * Service responsible for handling capabilities-related operations.
 * Extends the RestService to provide specific functionality for Capabilities entities.
 * This service allows querying capabilities information from specified URLs.
 */
@Injectable({
  providedIn: 'root'
})
export class CapabilitiesService extends RestService<Capabilities> {

  /** 
   * API endpoint path for capabilities
   * Used as a base URL for capabilities-related requests
   */
  public CAPABILITIES_API = 'helpers/capabilities?url=';

  /**
   * Creates an instance of CapabilitiesService.
   * @param injector - Angular injector instance for dependency injection
   * @param http - HttpClient for making HTTP requests
   */
  constructor(injector: Injector, private http: HttpClient) {
    super(Capabilities, "helpers/capabilities?url=", injector);
  }

  /**
   * Retrieves capabilities information from a specified URL.
   * @param url - The URL to fetch capabilities information from
   * @returns Observable that emits the capabilities information or an empty observable if no URL is provided
   */
  getInfo(url: string): Observable<any> {
    if (url) {
      const headerDict = {
        'Charset': 'UTF-8'
      }
      const requestOptions = {
        headers: new HttpHeaders(headerDict),
      };
      const finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API).concat(url);
      return this.http.get(finalUrl, requestOptions);
    } else {
      return of()
    }
  }

}
