import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat';
/** Authentication service*/
import * as ɵngcc0 from '@angular/core';
export declare class AuthService {
    private http;
    /** API base URL */
    SERVER_API_URL: string;
    /** constructor*/
    constructor(http: HttpClient);
    /** get current user jwt token from session storage*/
    getToken(): string;
    /** login operation */
    login(credentials: any): Observable<any>;
    /** login operation with jwt token */
    loginWithToken(jwt: any): Promise<any>;
    /** store jwt token in session storage*/
    storeAuthenticationToken(jwt: any): void;
    /** check whether current user is logged in*/
    isLoggedIn(): string;
    /** check whether current user is logged out*/
    isLoggedOut(): boolean;
    /** logout operation */
    logout(): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AuthService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<AuthService>;
}

//# sourceMappingURL=auth.service.d.ts.map