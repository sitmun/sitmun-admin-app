import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';

import {Observable, of} from 'rxjs';

import {RestService} from '@app/core/hal/rest/rest.service';

import {Capabilities} from '../models/capabilities.model';

/**
 * Service responsible for handling capabilities-related operations.
 * Extends the RestService to provide specific functionality for Capabilities entities.
 * This service allows querying capabilities information from specified URLs.
 */
@Injectable({
  providedIn: 'root'
})
export class CapabilitiesService extends RestService<Capabilities> {

  public CAPABILITIES_API = 'helpers/capabilities';

  constructor(injector: Injector, private http: HttpClient) {
    super(Capabilities, 'helpers/capabilities', injector);
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
        params: { url },
      };
      return this.http.get(
        this.resourceService.getResourceUrl(this.CAPABILITIES_API),
        requestOptions
      );
    } else {
      return of(null);
    }
  }

}
