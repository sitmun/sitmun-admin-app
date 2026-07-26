import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {EMPTY, Observable, defer, throwError} from 'rxjs';
import {catchError, finalize, shareReplay, tap} from 'rxjs/operators';

import {AccountService} from '@app/core/account/account.service';
import {LoginService} from '@app/core/auth/login.service';
import {NotificationService} from '@app/services/notification.service';
import {environment} from '@environments/environment';

const EXCLUDED_SESSION_PATHS = ['account', 'authenticate', 'auth', 'login'];
export const SUPPRESS_SESSION_VALIDATION = new HttpContextToken<boolean>(() => false);

export function isProtectedBackendRequest(
  requestUrl: string,
  backendBaseUrl: string,
  applicationOrigin: string
): boolean {
  try {
    const backendUrl = new URL(backendBaseUrl, applicationOrigin);
    const url = new URL(requestUrl, applicationOrigin);
    const apiPath = `${backendUrl.pathname.replace(/\/+$/, '')}/api/`;

    if (url.origin !== backendUrl.origin || !url.pathname.startsWith(apiPath)) {
      return false;
    }

    const resourcePath = url.pathname.slice(apiPath.length).replace(/\/+$/, '');
    return resourcePath.length > 0 && !EXCLUDED_SESSION_PATHS.some(
      path => resourcePath === path || resourcePath.startsWith(`${path}/`)
    );
  } catch {
    return false;
  }
}

/** Interceptor for authentication expired response in API requests */
@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  private validation$: Observable<unknown> | null = null;
  private transientWarningShown = false;

    /** constructor */
    constructor(
        private accountService: AccountService,
        private loginService: LoginService,
        private notificationService: NotificationService,
        private router: Router
    ) {}

    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
          catchError(
                (err: unknown) => {
                    if (err instanceof HttpErrorResponse) {
                      const onLogin = this.router.url.startsWith('/login');

                      if (
                        err.status === 401 &&
                        !onLogin &&
                        !request.context.get(SUPPRESS_SESSION_VALIDATION) &&
                        isProtectedBackendRequest(request.url, environment.apiBaseURL, globalThis.location.origin)
                      ) {
                        this.validateSession();
                      }
                    }
                  return throwError(() => err)
                }
            )
        );
    }

  private validateSession(): void {
    if (!this.validation$) {
      const context = new HttpContext().set(SUPPRESS_SESSION_VALIDATION, true);
      this.validation$ = defer(() => this.accountService.get(context)).pipe(
        tap(() => {
          this.transientWarningShown = false;
        }),
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.loginService.clearSession();
            void this.router.navigate(['/login']);
          } else if (!this.transientWarningShown) {
            this.transientWarningShown = true;
            this.notificationService.showWarning(
              'auth.sessionValidation.title',
              'auth.sessionValidation.unavailable'
            );
          }
          return EMPTY;
        }),
        finalize(() => {
          this.validation$ = null;
        }),
        shareReplay({bufferSize: 1, refCount: true})
      );
    }

    this.validation$.subscribe();
  }
}
