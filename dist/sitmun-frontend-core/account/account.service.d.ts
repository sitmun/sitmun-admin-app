import { User } from '../user/user.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Account manager service */
export declare class AccountService extends RestService<User> {
    private http;
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
}
