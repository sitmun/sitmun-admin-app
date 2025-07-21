import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import { UtilsService } from '@app/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesInterceptorStateService {
  private enabled = true;

  enable() {
    this.enabled = true;
    console.log("MessagesInterceptor enabled");
  }

  disable() {
    this.enabled = false;
    console.log("MessagesInterceptor disabled");
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

@Injectable()
export class MessagesInterceptor implements HttpInterceptor {
    private utilsService: UtilsService;

    constructor(
        private injector: Injector,
        private stateService: MessagesInterceptorStateService
    ) {
        // Lazy load UtilsService to break circular dependency
        setTimeout(() => {
            this.utilsService = this.injector.get(UtilsService);
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get UtilsService if not already loaded
        if (!this.utilsService) {
            this.utilsService = this.injector.get(UtilsService);
        }

        const intercept: boolean = request.url.indexOf("/api/login") == -1
        && request.url.indexOf("/api/account") == -1 &&  request.url.indexOf("/api/authenticate")==-1
        && this.stateService.isEnabled();
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
