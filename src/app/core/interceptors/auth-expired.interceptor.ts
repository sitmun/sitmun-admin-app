import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '@app/core/auth/login.service';

/** Interceptor for authentication expired response in API requests */
@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

    /** constructor */
    constructor(private loginService: LoginService) {}

    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {},
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            this.loginService.logout();
                        }
                    }
                }
            )
        );
    }
}
