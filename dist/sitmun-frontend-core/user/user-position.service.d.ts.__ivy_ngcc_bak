import { RestService } from '../angular-hal/src/lib/rest.service';
import { UserPosition } from './user-position.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
/** User position manager service */
export declare class UserPositionService extends RestService<UserPosition> {
    private http;
    /** API resource path */
    USER_POSITION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove user position*/
    remove(item: UserPosition): Observable<Object>;
    /** save user position*/
    save(item: any): Observable<any>;
}
