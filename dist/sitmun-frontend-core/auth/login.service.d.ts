import { AuthService } from './auth.service';
import { Principal } from './principal.service';
/** Login service*/
import * as ɵngcc0 from '@angular/core';
export declare class LoginService {
    private authServerProvider;
    private principal;
    /** constructor */
    constructor(authServerProvider: AuthService, principal: Principal);
    /**Login operation*/
    login(credentials: any, callback?: any): Promise<{}>;
    /**login with jwt token */
    loginWithToken(jwt: any): Promise<any>;
    /** logout operation */
    logout(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<LoginService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<LoginService>;
}

//# sourceMappingURL=login.service.d.ts.map