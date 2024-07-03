import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ResourceService} from '../angular-hal/src/lib/resource.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService{

    /** API resource path */
    public DASHBOARD_API = 'dashboard/info';
    public DASHBOARD_EMBEDDED= 'dashboard';
    /** constructor */
    constructor(       
      private http: HttpClient,
      private resourceService: ResourceService) {
    }
  
    /** get all kpi */
    getAll(): Observable<any> {
      return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(response => response[this.DASHBOARD_EMBEDDED]);
    }
}
