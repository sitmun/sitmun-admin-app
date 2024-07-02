import { CartographyGroup } from './cartography-group.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** CartographyGroup manager service */
export declare class CartographyGroupService extends RestService<CartographyGroup> {
    private http;
    /** API resource path */
    CARTOGRAPHY_GROUP_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove cartography group*/
    remove(item: CartographyGroup): Observable<Object>;
    /** save cartography group*/
    save(item: CartographyGroup): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<CartographyGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDef<CartographyGroupService>;
}
