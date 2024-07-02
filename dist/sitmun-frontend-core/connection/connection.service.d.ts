import { Connection } from './connection.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Connection manager service */
export declare class ConnectionService extends RestService<Connection> {
    private http;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove connection*/
    remove(item: Connection): Observable<Object>;
    /** save connection*/
    save(item: Connection): Observable<any>;
    testConnection(item: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<ConnectionService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ConnectionService>;
}
