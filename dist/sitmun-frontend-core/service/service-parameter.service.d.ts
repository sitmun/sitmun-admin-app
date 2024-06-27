import { ServiceParameter } from './service-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Service parameter manager service */
export declare class ServiceParameterService extends RestService<ServiceParameter> {
    private http;
    /** API resource path */
    SERVICE_PARAMETER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove service parameter*/
    remove(item: ServiceParameter): Observable<Object>;
    /** save service parameter*/
    save(item: ServiceParameter): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<ServiceParameterService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ServiceParameterService>;
}
