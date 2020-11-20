import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
/** Interceptor for authentication token in API requests */
export declare class AuthInterceptor implements HttpInterceptor {
    /** API base path*/
    SERVER_API_URL: string;
    TEST_SERVER_API_URL: string;
    /** constructor*/
    constructor();
    /** request handler */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
