import { RestService } from '../angular-hal/src/lib/rest.service';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** User manager service */
export declare class UserService extends RestService<User> {
    private http;
    /** API resource path */
    USER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove user*/
    remove(item: User): Observable<Object>;
    /** save user*/
    save(item: any): Observable<any>;
    /** change password o given user id */
    changePassword(id: any, item: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<UserService, never>;
    static ɵprov: i0.ɵɵInjectableDef<UserService>;
}
