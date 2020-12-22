import { RestService } from '../angular-hal/src/lib/rest.service';
import { UserPosition } from './user-position.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
/** User position manager service */
import * as ɵngcc0 from '@angular/core';
export declare class UserPositionService extends RestService<UserPosition> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    USER_POSITION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove user position*/
    remove(item: UserPosition): Observable<Object>;
    /** save user position*/
    save(item: any): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<UserPositionService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<UserPositionService>;
}

//# sourceMappingURL=user-position.service.d.ts.map