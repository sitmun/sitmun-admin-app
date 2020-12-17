import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat';
/** Authentication service*/
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
}
