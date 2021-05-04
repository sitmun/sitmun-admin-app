import { AuthService } from './auth.service';
import { Principal } from './principal.service';
/** Login service*/
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
}
