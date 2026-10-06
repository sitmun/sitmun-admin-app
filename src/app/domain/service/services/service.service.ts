import {HttpClient, HttpContext} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RestService } from '@app/core/hal/rest/rest.service';
import {SUPPRESS_HTTP_NOTIFICATION} from '@app/core/interceptors/messages.interceptor';

import {AffectedApplication, ServiceAccessObservation, ServiceAccessSamples, ServiceAccessSummary, ServiceAccessTrend, ServiceUsageRange, ServiceUsageView} from '../models/service-access.model';
import { Service } from '../models/service.model';

/** Service manager service */
@Injectable()
export class ServiceService extends RestService<Service> {

  private readonly http: HttpClient;

  /** constructor */
  constructor(injector: Injector) {
    super(Service, "services", injector);
    this.http = injector.get(HttpClient);
  }

  private get url(): string {
    return this.resourceService.getResourceUrl('services');
  }

  accessCheck(id: number): Observable<ServiceAccessObservation> {
    return this.http.post<ServiceAccessObservation>(
      `${this.url}/${id}/access-check`,
      {},
      {context: new HttpContext().set(SUPPRESS_HTTP_NOTIFICATION, true)},
    );
  }

  accessSummaries(): Observable<ServiceAccessSummary[]> {
    return this.http.get<ServiceAccessSummary[]>(`${this.url}/access-summaries`);
  }

  affectedApplications(): Observable<AffectedApplication[]> {
    return this.http.get<AffectedApplication[]>(`${this.url}/affected-applications`);
  }

  accessTrend(id: number): Observable<ServiceAccessTrend> {
    return this.http.get<ServiceAccessTrend>(`${this.url}/${id}/access-trend`, {params: {bucket: '10m'}});
  }

  accessSamples(id: number): Observable<ServiceAccessSamples> {
    return this.http.get<ServiceAccessSamples>(`${this.url}/${id}/access-samples`);
  }

  usage(id: number, range: ServiceUsageRange): Observable<ServiceUsageView> {
    return this.http.get<ServiceUsageView>(`${this.url}/${id}/usage`, {params: {range}});
  }

  fetchWmsItems(): Observable<Service[]> {
    return this.resourceService
      .search(Service, 'wms', 'services', '_embedded', { notPaged: true }, undefined, undefined, false)
      .pipe(map((resourceArray) => resourceArray.result));
  }

}
