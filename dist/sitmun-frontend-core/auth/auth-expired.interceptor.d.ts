import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Principal } from './principal.service';
import * as i0 from "@angular/core";
/** Interceptor for authentication expired response in API requests */
export declare class AuthExpiredInterceptor implements HttpInterceptor {
    private router;
    private authService;
    private principal;
    /** constructor */
    constructor(router: Router, authService: AuthService, principal: Principal);
    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDef<AuthExpiredInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthExpiredInterceptor>;
}
