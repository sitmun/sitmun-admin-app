import { Cartography } from './cartography.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Cartography manager service */
export declare class CartographyService extends RestService<Cartography> {
    private http;
    /** API resource path */
    CARTOGRAPHY_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove cartography*/
    remove(item: Cartography): Observable<Object>;
    /** save cartography*/
    save(item: Cartography): Observable<any>;
}
