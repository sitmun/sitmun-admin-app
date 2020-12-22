import { ApplicationParameter } from './application-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Application parameter manager service */
export declare class ApplicationParameterService extends RestService<ApplicationParameter> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    APPLICATION_PARAMETER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove application*/
    remove(item: ApplicationParameter): Observable<Object>;
    /** save application*/
    save(item: ApplicationParameter): Observable<any>;
}
