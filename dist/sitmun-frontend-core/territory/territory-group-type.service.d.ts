import { TerritoryGroupType } from './territory-group-type.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
export declare class TerritoryGroupTypeService extends RestService<TerritoryGroupType> {
    private http;
    /** API resource path */
    TERRITORYGROUPTYPE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove territory*/
    remove(item: TerritoryGroupType): Observable<Object>;
    /** save territory*/
    save(item: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<TerritoryGroupTypeService, never>;
    static ɵprov: i0.ɵɵInjectableDef<TerritoryGroupTypeService>;
}
