import { Territory } from './territory.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Territory manager service */
export declare class TerritoryService extends RestService<Territory> {
    private http;
    /** API resource path */
    TERRITORY_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove territory*/
    remove(item: Territory): Observable<Object>;
    /** save territory*/
    save(item: Territory): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<TerritoryService, never>;
    static ɵprov: i0.ɵɵInjectableDef<TerritoryService>;
}
