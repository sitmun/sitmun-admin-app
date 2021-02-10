import { ApplicationBackground } from './application-background.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Application background manager service */
export declare class ApplicationBackgroundService extends RestService<ApplicationBackground> {
    private http;
    /** API resource path */
    APPLICATION_BACKGROUND_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove application background*/
    remove(item: ApplicationBackground): Observable<Object>;
    /** save application background*/
    save(item: ApplicationBackground): Observable<any>;
}
