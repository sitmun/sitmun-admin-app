import { CartographyFilter } from './cartography-filter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** CartographyFilter manager service */
export declare class CartographyFilterService extends RestService<CartographyFilter> {
    private http;
    /** API resource path */
    CARTOGRAPHY_FILTER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove cartography filter*/
    remove(item: CartographyFilter): Observable<Object>;
    /** save cartography availability*/
    save(item: CartographyFilter): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<CartographyFilterService, never>;
    static ɵprov: i0.ɵɵInjectableDef<CartographyFilterService>;
}
