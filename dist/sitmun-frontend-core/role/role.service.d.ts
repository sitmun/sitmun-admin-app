import { Role } from './role.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Role manager service */
export declare class RoleService extends RestService<Role> {
    private http;
    /** API resource path */
    ROLE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove role*/
    remove(item: Role): Observable<Object>;
    /** save role*/
    save(item: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<RoleService, never>;
    static ɵprov: i0.ɵɵInjectableDef<RoleService>;
}
