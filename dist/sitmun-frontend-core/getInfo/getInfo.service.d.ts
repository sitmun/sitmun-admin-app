import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';
import * as ɵngcc0 from '@angular/core';
export declare class GetInfoService extends RestService<Info> {
    private http;
    /** API resource path */
    INFO_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** save service*/
    getInfo(url: string): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<GetInfoService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<GetInfoService>;
}

//# sourceMappingURL=getInfo.service.d.ts.map