import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { TerritoryType } from './territory-type.model';
/** TerritoryType manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TerritoryTypeService extends RestService<TerritoryType> {
    private http;
    /** API resource path */
    TERRITORYTYPE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove territory type*/
    remove(item: TerritoryType): Observable<Object>;
    /** save territory type*/
    save(item: any): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TerritoryTypeService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TerritoryTypeService>;
}

//# sourceMappingURL=territory-type.service.d.ts.map