import { CartographyParameter } from './cartography-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Service parameter manager service */
export declare class CartographyParameterService extends RestService<CartographyParameter> {
    private http;
    /** API resource path */
    CARTOGRAPHY_PARAMETER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove service parameter*/
    remove(item: CartographyParameter): Observable<Object>;
    /** save service parameter*/
    save(item: CartographyParameter): Observable<any>;
}
