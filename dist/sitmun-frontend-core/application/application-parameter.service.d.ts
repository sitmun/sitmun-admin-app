import { ApplicationParameter } from './application-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Application parameter manager service */
import * as ɵngcc0 from '@angular/core';
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ApplicationParameterService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ApplicationParameterService>;
}

//# sourceMappingURL=application-parameter.service.d.ts.map