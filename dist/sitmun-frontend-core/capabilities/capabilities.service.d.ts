import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Capabilitie } from './capabilitie.model';
export declare class CapabilitiesService extends RestService<Capabilitie> {
    private http;
    /** API resource path */
    CAPABILITIES_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** save service*/
    getInfo(url: string): Observable<any>;
}
