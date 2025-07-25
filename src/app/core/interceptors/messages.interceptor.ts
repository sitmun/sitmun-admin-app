import {EMPTY, Observable, throwError} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {catchError, finalize, map} from 'rxjs/operators';
import {NotificationService} from '@app/services/notification.service';
import {UtilsService} from '@app/services/utils.service';

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

  private notificationService: NotificationService;

    constructor(
        private injector: Injector,
        private stateService: MessagesInterceptorStateService
    ) {
      // Lazy load services to break circular dependency
        setTimeout(() => {
            this.utilsService = this.injector.get(UtilsService);
          this.notificationService = this.injector.get(NotificationService);
        });
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | never> {
    // Get services if not already loaded
    if (!this.utilsService || !this.notificationService) {
            this.utilsService = this.injector.get(UtilsService);
      this.notificationService = this.injector.get(NotificationService);
        }

        const intercept: boolean = request.url.indexOf("/api/login") == -1
        && request.url.indexOf("/api/account") == -1 &&  request.url.indexOf("/api/authenticate")==-1
        && this.stateService.isEnabled();
        if (intercept) {
            this.utilsService.enableLoading();

            return next.handle(request).pipe(
                finalize(() => {
                    this.utilsService.disableLoading();
                }),
                catchError((error) => {
                    if(error.status!=404){
                      this.notificationService.showError('backend.error.title', error.error?.message || 'backend.error.unknown', true);
                      return throwError(() => error);
                    }
                  return EMPTY;
                }),
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        switch (request.method) {
                            case "POST":
                              this.notificationService.showSuccess('backend.status.title', 'backend.operation.created');
                                break;
                            case "PUT":
                              this.notificationService.showSuccess('backend.status.title', 'backend.operation.updated');
                                break;
                            case "DELETE":
                              this.notificationService.showSuccess('backend.status.title', 'backend.operation.delete');
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
