import { RestService } from '../angular-hal/src/lib/rest.service';
import { UserConfiguration } from './user-configuration.model';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** User configuration manager service */
export declare class UserConfigurationService extends RestService<UserConfiguration> {
    private http;
    /** API resource path */
    USER_CONFIGURATION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove user configuration*/
    remove(item: UserConfiguration): Observable<Object>;
    /** save user configuration*/
    save(item: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<UserConfigurationService, never>;
    static ɵprov: i0.ɵɵInjectableDef<UserConfigurationService>;
}
