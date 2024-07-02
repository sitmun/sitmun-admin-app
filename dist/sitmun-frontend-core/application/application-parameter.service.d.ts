import { ApplicationParameter } from './application-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Application parameter manager service */
export declare class ApplicationParameterService extends RestService<ApplicationParameter> {
    private http;
    /** API resource path */
    APPLICATION_PARAMETER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove application*/
    remove(item: ApplicationParameter): Observable<Object>;
    /** save application*/
    save(item: ApplicationParameter): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<ApplicationParameterService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ApplicationParameterService>;
}
