import { Connection } from './connection.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Connection manager service */
import * as ɵngcc0 from '@angular/core';
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ConnectionService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ConnectionService>;
}

//# sourceMappingURL=connection.service.d.ts.map