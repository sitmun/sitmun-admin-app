import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';

import {Observable, of} from 'rxjs';

import {RestService} from '@app/core/hal/rest/rest.service';

import {Capabilities} from '../models/capabilities.model';

/** Form overlay posted to `POST /helpers/capabilities`. Omit `id` on create/duplicate. */
export type ServiceCapabilitiesProbe = {
  url: string;
  type: string;
  id?: number;
  authenticationMode?: string | null;
  user?: string | null;
  password?: string | null;
};

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
   * @param probe - Form overlay for the origin GetCapabilities request
   * @returns Observable that emits the capabilities information or an empty observable if url/type are missing
   */
  getInfo(probe: ServiceCapabilitiesProbe | null | undefined): Observable<any> {
    if (!probe?.url || !probe?.type) {
      return of(null);
    }
    const body: Record<string, unknown> = {
      url: probe.url,
      type: probe.type,
    };
    if (typeof probe.id === 'number' && probe.id >= 1) {
      body.id = probe.id;
    }
    if (probe.authenticationMode != null) {
      body.authenticationMode = probe.authenticationMode;
    }
    if (probe.user != null) {
      body.user = probe.user;
    }
    if (probe.password) {
      body.password = probe.password;
    }
    return this.http.post(
      this.resourceService.getResourceUrl(this.CAPABILITIES_API),
      body,
      { headers: new HttpHeaders({ Charset: 'UTF-8' }) }
    );
  }

}
