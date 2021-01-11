import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs-compat';
import { ResourceService } from '../angular-hal/src/lib/resource.service';
/** Authentication service*/
export declare class AuthService {
    private http;
    private resourceService;
    /** API resource path */
    AUTH_API: string;
    /** constructor*/
    constructor(http: HttpClient, resourceService: ResourceService);
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
