import { AuthService } from './auth.service';
import { Principal } from './principal.service';
import * as i0 from "@angular/core";
/** Login service*/
export declare class LoginService {
    private authServerProvider;
    private principal;
    /** constructor */
    constructor(authServerProvider: AuthService, principal: Principal);
    /**Login operation*/
    login(credentials: any, callback?: any): Promise<unknown>;
    /**login with jwt token */
    loginWithToken(jwt: any): Promise<any>;
    /** logout operation */
    logout(): void;
    static ɵfac: i0.ɵɵFactoryDef<LoginService, never>;
    static ɵprov: i0.ɵɵInjectableDef<LoginService>;
}
