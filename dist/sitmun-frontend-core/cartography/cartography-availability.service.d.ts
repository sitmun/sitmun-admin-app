import { CartographyAvailability } from './cartography-availability.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** CartographyAvailability manager service */
export declare class CartographyAvailabilityService extends RestService<CartographyAvailability> {
    private http;
    /** API resource path */
    CARTOGRAPHY_AVAILABILITY_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove cartography availability*/
    remove(item: CartographyAvailability): Observable<Object>;
    /** save cartography availability*/
    save(item: CartographyAvailability): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<CartographyAvailabilityService, never>;
    static ɵprov: i0.ɵɵInjectableDef<CartographyAvailabilityService>;
}
