import { User } from '../user/user.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Account manager service */
import * as ɵngcc0 from '@angular/core';
export declare class AccountService extends RestService<User> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    ACCOUNT_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** get logged in user account*/
    get(): Observable<any>;
    /** save account*/
    save(item: any): Observable<any>;
    /** change logged in user account*/
    changePassword(item: any): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AccountService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<AccountService>;
}

//# sourceMappingURL=account.service.d.ts.map