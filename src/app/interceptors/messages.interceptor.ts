import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';
import { debug } from 'console';

@Injectable()
export class MessagesInterceptor implements HttpInterceptor {

    constructor(private utilsService: UtilsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     //  const intercept: boolean =;
        //tractem request
        if ( request.url.indexOf("/api/login") == -1  && request.url.indexOf("/api/account") == -1 
            &&  request.url.indexOf("/api/authenticate")==-1 && request.url.includes("/api/") ) {
            this.utilsService.enableLoading();
          
            //tractem response
            return next.handle(request).pipe(
                finalize(() => {
                    this.utilsService.disableLoading();
                }),
                catchError((error) => {
                    this.utilsService.showErrorMessage(error);
                    return throwError(error);
                }),
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        switch (request.method) {
                            case "POST":
                                this.utilsService.showMessage("ok-created");
                                break;
                            case "PUT":
                                this.utilsService.showMessage("ok-updated");
                                break;
                            case "DELETE":
                                this.utilsService.showMessage("ok-deleted");
                                break;
                        }
                    }
                    return event;
                })
            );
        }
        else if(!request.url.includes("/api/" ) && !request.url.includes("assets") ){
            request = request.clone({
                //url: request.url,
                setHeaders: {
                    "Access-Control-Allow-Origin": "*",
                    "Accept": "*/*",
                    "Allow-Control-Allow-Methods":"GET, POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization"
                }
            });
            return next.handle(request);
        }
        else return next.handle(request);

    }
}
