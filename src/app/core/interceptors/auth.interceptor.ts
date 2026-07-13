import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

/** Adds credentials and the admin client-selector header to backend requests. */
export class AuthInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isBackend = request.url.startsWith(environment.apiBaseURL);
        request = request.clone({
            withCredentials: true,
            ...(isBackend ? { setHeaders: { 'X-SITMUN-Client': 'admin' } } : {})
        });
        return next.handle(request);
    }

}
