import {EMPTY, Observable, throwError} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {catchError, finalize, map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '@app/services/notification.service';
import {UtilsService} from '@app/services/utils.service';
import {ErrorTrackingService} from '@app/services/error-tracking.service';
import {getProblemTranslationKey, isProblemDetail, getErrorMessage} from '@app/utils/problem-detail.utils';
import {ENTITY_TYPE_KEY, ENTITY_NAME_KEY} from '@app/core/hal/resource/resource.service';

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
  private translateService: TranslateService;
  private errorTrackingService: ErrorTrackingService;

    constructor(
        private injector: Injector,
        private stateService: MessagesInterceptorStateService
    ) {
      // Lazy load services to break circular dependency
        setTimeout(() => {
            this.utilsService = this.injector.get(UtilsService);
          this.notificationService = this.injector.get(NotificationService);
          this.translateService = this.injector.get(TranslateService);
          this.errorTrackingService = this.injector.get(ErrorTrackingService);
        });
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | never> {
    // Get services if not already loaded
    if (!this.utilsService || !this.notificationService || !this.translateService || !this.errorTrackingService) {
            this.utilsService = this.injector.get(UtilsService);
      this.notificationService = this.injector.get(NotificationService);
      this.translateService = this.injector.get(TranslateService);
      this.errorTrackingService = this.injector.get(ErrorTrackingService);
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
                      let title: string;
                      let message: string;
                      
                      // Check if RFC 9457 Problem Detail format
                      if (isProblemDetail(error)) {
                        const params: Record<string, any> = {};
                        
                        // Extract and translate operation from HTTP method
                        const operation = this.getTranslatedOperation(request.method);
                        if (operation) {
                          params['operation'] = operation;
                        }
                        
                        // Extract entity type and name from HTTP context
                        const entityTypeKey = request.context.get(ENTITY_TYPE_KEY);
                        const entityName = request.context.get(ENTITY_NAME_KEY);
                        
                        // Extract and translate entity type if present
                        if (entityTypeKey) {
                          const translatedEntityType = this.getTranslatedName(entityTypeKey);
                          if (translatedEntityType) {
                            params['entityType'] = translatedEntityType;
                          }
                        }
                        
                        // Add entity name if present
                        if (entityName) {
                          params['entityName'] = entityName;
                        }
                        
                        // Extract and translate referencing entity name (from backend)
                        const referencingKey = error.error?.properties?.referencingEntityTranslationKey;
                        if (referencingKey) {
                          const translatedRef = this.getTranslatedName(referencingKey);
                          if (translatedRef) {
                            params['referencingEntityName'] = translatedRef;
                          }
                        }
                        
                        // Choose translation key based on available params and error type
                        const translationKey = this.getConstraintTranslationKey(error, params);
                        
                        // Translate the error message
                        let translated = this.translateService.instant(translationKey, params);
                        
                        // If translation returns the key itself, use backend detail
                        if (translated === translationKey) {
                          translated = getErrorMessage(error);
                        }
                        
                        // Replace any remaining placeholders and clean up
                        translated = this.replacePlaceholders(translated, params);
                        translated = this.removeUnreplacedPlaceholders(translated);
                        
                        message = translated;
                        
                        // Use contextual title based on status code
                        if (error.status >= 400 && error.status < 500) {
                          // Client errors: validation, business rules, not found, etc.
                          title = 'common.error.validationError';
                        } else {
                          // Server errors (5xx)
                          title = 'backend.error.title';
                        }
                      } else {
                        // Legacy format
                        message = error.error?.message || 'backend.error.unknown';
                        title = 'backend.error.title';
                      }
                      
                      // Track HTTP error in ErrorTrackingService (with additional null check)
                      try {
                        if (!this.errorTrackingService) {
                          this.errorTrackingService = this.injector.get(ErrorTrackingService, null);
                        }
                        if (this.errorTrackingService && error.status >= 400) {
                          this.errorTrackingService.addError(
                            message,
                            'http',
                            {
                              httpStatus: error.status,
                              url: request.url,
                              details: error.error
                            }
                          );
                        }
                      } catch (e) {
                        // ErrorTrackingService not available - ignore silently
                        // This can happen during app initialization
                      }
                      
                      this.notificationService.showError(title, message, true);
                      return throwError(() => error);
                    }
                  return EMPTY;
                }),
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        // Only show success notifications if interceptor is enabled
                        // This allows suppressing notifications during batch operations
                        if (this.stateService.isEnabled()) {
                            // Show unified success message for all successful operations
                            if (request.method === "POST" || request.method === "PUT" || request.method === "DELETE") {
                                this.notificationService.showSuccess('backend.status.title', 'backend.operation.saved');
                            }
                        }
                    }
                    return event;
                })
            );
        }
        else return next.handle(request);
    }

  /** Translates a key to current language, returns null if translation fails. */
  private getTranslatedName(key: string): string | null {
    if (!key || !this.translateService) {
      return null;
    }
    try {
      const translated = this.translateService.instant(key);
      return (translated && translated !== key) ? translated : null;
    } catch {
      return null;
    }
  }

  /** Gets translated operation verb from HTTP method. */
  private getTranslatedOperation(method: string): string | null {
    const methodToKey: Record<string, string> = {
      'DELETE': 'operation.delete',
      'POST': 'operation.create',
      'PUT': 'operation.update',
      'PATCH': 'operation.update'
    };
    const key = methodToKey[method];
    return key ? this.getTranslatedName(key) : null;
  }

  /**
   * Chooses the appropriate translation key based on available params.
   * - full: has operation, entityType, entityName, referencingEntityName
   * - partial: has operation, entityType, entityName (no referencingEntityName)
   * - minimal: has only operation (or nothing)
   */
  private getConstraintTranslationKey(
    error: any,
    params: Record<string, any>
  ): string {
    // Only use constraint-specific keys for 422 data integrity violations
    const isConstraintError = error.status === 422 &&
      error.error?.type?.includes('data-integrity-violation');
    
    if (!isConstraintError) {
      return getProblemTranslationKey(error);
    }
    
    const hasEntityInfo = params['entityType'] && params['entityName'];
    const hasReferencingEntity = !!params['referencingEntityName'];
    
    if (hasEntityInfo && hasReferencingEntity) {
      return 'error.data-integrity-violation.constraint.full';
    } else if (hasEntityInfo) {
      return 'error.data-integrity-violation.constraint.partial';
    } else if (params['operation']) {
      return 'error.data-integrity-violation.constraint.minimal';
    }
    return 'error.data-integrity-violation';
  }

  /** Replaces placeholders in message with parameter values. */
  private replacePlaceholders(
    message: string,
    params: Record<string, any>
  ): string {
    if (!message || !params || Object.keys(params).length === 0) {
      return message;
    }
    let result = message;
    for (const [key, value] of Object.entries(params)) {
      const escaped = `{{${key}}}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(escaped, 'g'), String(value));
    }
    return result;
  }

  /** Removes any unreplaced {{placeholder}} from the message. */
  private removeUnreplacedPlaceholders(message: string): string {
    return message.replace(/\{\{[^}]+\}\}/g, '').replace(/\s+/g, ' ').trim();
  }
}
