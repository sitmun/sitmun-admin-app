import { Cartography } from './cartography.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Cartography manager service */
import * as ɵngcc0 from '@angular/core';
export declare class CartographyService extends RestService<Cartography> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    CARTOGRAPHY_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove cartography*/
    remove(item: Cartography): Observable<Object>;
    /** save cartography*/
    save(item: Cartography): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CartographyService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<CartographyService>;
}

//# sourceMappingURL=cartography.service.d.ts.map