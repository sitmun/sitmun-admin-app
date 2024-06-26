import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { CartographyStyle } from './cartography-style.model';
import * as ɵngcc0 from '@angular/core';
export declare class CartographyStyleService extends RestService<CartographyStyle> {
    private http;
    /** API resource path */
    CARTOGRAPHY_STYLES_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove service parameter*/
    remove(item: CartographyStyle): Observable<Object>;
    /** save service parameter*/
    save(item: CartographyStyle): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CartographyStyleService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<CartographyStyleService>;
}

//# sourceMappingURL=cartography-style.service.d.ts.map