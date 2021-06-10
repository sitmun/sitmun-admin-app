import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable()
export class MessagesInterceptor implements HttpInterceptor {

    constructor(private utilsService: UtilsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const intercept: boolean = request.url.indexOf("/api/login") == -1 
        && request.url.indexOf("/api/account") == -1 &&  request.url.indexOf("/api/authenticate")==-1;
        //tractem request
        if (intercept) {
            this.utilsService.enableLoading();

            //tractem response
            return next.handle(request).pipe(
                finalize(() => {
                    this.utilsService.disableLoading();
                }),
                catchError((error) => {
                    if(error.status!=404){
                        this.utilsService.showErrorMessage(error);
                        return throwError(error);
                    }
                    return [];
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
        else return next.handle(request);

    }
}
