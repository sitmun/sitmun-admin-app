import { CartographyAvailability } from './cartography-availability.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** CartographyAvailability manager service */
import * as ɵngcc0 from '@angular/core';
export declare class CartographyAvailabilityService extends RestService<CartographyAvailability> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    CARTOGRAPHY_AVAILABILITY_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove cartography availability*/
    remove(item: CartographyAvailability): Observable<Object>;
    /** save cartography availability*/
    save(item: CartographyAvailability): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CartographyAvailabilityService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<CartographyAvailabilityService>;
}

//# sourceMappingURL=cartography-availability.service.d.ts.map