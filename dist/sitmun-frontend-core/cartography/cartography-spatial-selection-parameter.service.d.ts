import { CartographyParameter } from './cartography-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Service parameter manager service */
import * as ɵngcc0 from '@angular/core';
export declare class CartographySpatialSelectionParameterService extends RestService<CartographyParameter> {
    private http;
    /** API resource path */
    CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove service parameter*/
    remove(item: CartographyParameter): Observable<Object>;
    /** save service parameter*/
    save(item: CartographyParameter): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CartographySpatialSelectionParameterService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<CartographySpatialSelectionParameterService>;
}

//# sourceMappingURL=cartography-spatial-selection-parameter.service.d.ts.map