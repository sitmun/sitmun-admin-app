import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable()
export class MessagesInterceptor implements HttpInterceptor {

    constructor(private utilsService: UtilsService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var intercept = true
        //tractem request
        if (intercept) {
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
        else return next.handle(request);

    }
}
