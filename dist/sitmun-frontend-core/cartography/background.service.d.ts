import { Background } from './background.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Background manager service */
export declare class BackgroundService extends RestService<Background> {
    private http;
    /** API resource path */
    BACKGROUND_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove background*/
    remove(item: Background): Observable<Object>;
    /** save background*/
    save(item: Background): Observable<any>;
}
