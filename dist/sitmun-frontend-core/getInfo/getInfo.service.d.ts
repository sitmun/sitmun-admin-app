import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';
import * as i0 from "@angular/core";
export declare class GetInfoService extends RestService<Info> {
    private http;
    /** API resource path */
    INFO_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** save service*/
    getInfo(url: string): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<GetInfoService, never>;
    static ɵprov: i0.ɵɵInjectableDef<GetInfoService>;
}
