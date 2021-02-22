import { Territory } from './territory.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Territory manager service */
import * as ɵngcc0 from '@angular/core';
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TerritoryService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TerritoryService>;
}

//# sourceMappingURL=territory.service.d.ts.map