import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Interceptor for authentication token in API requests */
export class AuthInterceptor implements HttpInterceptor {

    /** constructor*/
    // Empty constructor - no dependencies needed

    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = sessionStorage.getItem('authenticationToken');
      if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }
        return next.handle(request);
    }

}
