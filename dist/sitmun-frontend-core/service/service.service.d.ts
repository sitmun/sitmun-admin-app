import { Service } from './service.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Service manager service */
export declare class ServiceService extends RestService<Service> {
    private http;
    /** API resource path */
    SERVICE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove service*/
    remove(item: Service): Observable<Object>;
    /** save service*/
    save(item: Service): Observable<any>;
}
