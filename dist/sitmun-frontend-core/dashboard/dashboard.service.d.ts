import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceService } from '../angular-hal/src/lib/resource.service';
import * as i0 from "@angular/core";
export declare class DashboardService {
    private http;
    private resourceService;
    /** API resource path */
    DASHBOARD_API: string;
    DASHBOARD_EMBEDDED: string;
    /** constructor */
    constructor(http: HttpClient, resourceService: ResourceService);
    /** get all kpi */
    getAll(): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<DashboardService, never>;
    static ɵprov: i0.ɵɵInjectableDef<DashboardService>;
}
