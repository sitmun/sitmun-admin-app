import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {LoginService} from '@app/core/auth/login.service';

/** Interceptor for authentication expired response in API requests */
@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

    /** constructor */
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

  private handlingUnauthorized = false;

    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
          catchError(
                (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                      const unauthorized = err.status === 401;
                      const isAuth = request.url.includes('authenticate');
                      const onLogin = this.router.url.startsWith('/login');

                      if (unauthorized && !isAuth && !onLogin && !this.handlingUnauthorized) {
                        this.handlingUnauthorized = true;
                        // Clear only local state; do NOT POST logout, which would
                        // delete the shared access_token cookie and cascade the
                        // logout to every other tab on the next request.
                        this.loginService.clearSession();
                        void this.router.navigate(['/login']).finally(() => {
                          this.handlingUnauthorized = false;
                        });
                        // Defensive reset if navigation never settles.
                        setTimeout(() => {
                          this.handlingUnauthorized = false;
                        }, 3000);
                      }
                    }
                  return throwError(() => err)
                }
            )
        );
    }
}
