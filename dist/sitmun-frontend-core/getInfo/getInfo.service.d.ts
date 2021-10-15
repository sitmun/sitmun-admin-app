import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';
export declare class GetInfoService extends RestService<Info> {
    private http;
    /** API resource path */
    INFO_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** save service*/
    getInfo(url: string): Observable<any>;
}
