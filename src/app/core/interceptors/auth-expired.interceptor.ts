import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {LoginService} from '@app/core/auth/login.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

/** Interceptor for authentication expired response in API requests */
@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

    /** constructor */
    constructor(
        private loginService: LoginService,
        private router: Router
    ) {}

  private redirecting = false;

    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
          catchError(
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                      const unauthorized = err.status === 401 || err.status === 403;
                      const isAuth = request.url.includes('authenticate');
                      const onLogin = this.router.url.startsWith('/login');

                      if (unauthorized && !isAuth && !onLogin && !this.redirecting) {
                        this.redirecting = true;
                        this.loginService.logout();
                        void this.router.navigate(['/login']).finally(() => {
                          this.redirecting = false;
                        });
                      }
                    }
                  return throwError(() => err)
                }
            )
        );
    }
}
