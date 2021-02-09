import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
/** Interceptor for authentication token in API requests */
export declare class AuthInterceptor implements HttpInterceptor {
    /** constructor*/
    constructor();
    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
