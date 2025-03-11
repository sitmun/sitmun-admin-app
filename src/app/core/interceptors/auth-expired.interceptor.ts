import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '@app/core/auth/login.service';
import { Router } from '@angular/router';

/** Interceptor for authentication expired response in API requests */
@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

    /** constructor */
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {},
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401 && !request.url.includes('api/authenticate')) {
                            // Only logout if not already trying to authenticate
                            this.loginService.logout();
                            
                            // Force reload to clear all states and redirect to login
                            window.location.reload();
                        }
                    }
                }
            )
        );
    }
}
