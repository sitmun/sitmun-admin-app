/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ApplicationParameter } from './application-parameter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Application parameter manager service
 */
export class ApplicationParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(ApplicationParameter, "application-parameters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.APPLICATION_PARAMETER_API = 'application-parameters';
    }
    /**
     * remove application
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save application
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.application != null) {
                item.substituteRelation('application', item.application).subscribe(result => {
                }, error => console.error(error));
            }
        }
        else {
            item.application = item.application._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_PARAMETER_API), item);
        }
        return result;
    }
}
ApplicationParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ApplicationParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    ApplicationParameterService.prototype.APPLICATION_PARAMETER_API;
    /** @type {?} */
    ApplicationParameterService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24tcGFyYW1ldGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDckUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7OztBQUloRSxNQUFNLGtDQUFtQyxTQUFRLFdBQWlDOzs7Ozs7SUFPaEYsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxvQkFBb0IsRUFBRSx3QkFBd0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUQzQixTQUFJLEdBQUosSUFBSSxDQUFZOzs7O3lDQUhwQix3QkFBd0I7S0FLMUQ7Ozs7OztJQUdELE1BQU0sQ0FBQyxJQUEwQjtRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFaEQ7Ozs7OztJQUdELElBQUksQ0FBQyxJQUEwQjs7UUFDN0IsSUFBSSxNQUFNLENBQXFCO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLENBQUEsQ0FBQztnQkFDekIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2lCQUU5RSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBRUY7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVyRCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEVBQUcsSUFBSSxDQUFDLENBQUM7U0FDckc7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ2Y7OztZQW5DRixVQUFVOzs7O1lBTlUsUUFBUTtZQUNwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwbGljYXRpb25QYXJhbWV0ZXIgfSBmcm9tICcuL2FwcGxpY2F0aW9uLXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQXBwbGljYXRpb24gcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25QYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8QXBwbGljYXRpb25QYXJhbWV0ZXI+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIEFQUExJQ0FUSU9OX1BBUkFNRVRFUl9BUEkgPSAnYXBwbGljYXRpb24tcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEFwcGxpY2F0aW9uUGFyYW1ldGVyLCBcImFwcGxpY2F0aW9uLXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIGFwcGxpY2F0aW9uKi9cclxuICByZW1vdmUoaXRlbTogQXBwbGljYXRpb25QYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBhcHBsaWNhdGlvbiovXHJcbiAgc2F2ZShpdGVtOiBBcHBsaWNhdGlvblBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgICBpZiAoaXRlbS5hcHBsaWNhdGlvbiAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2FwcGxpY2F0aW9uJyxpdGVtLmFwcGxpY2F0aW9uKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uYXBwbGljYXRpb24gPSBpdGVtLmFwcGxpY2F0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQVBQTElDQVRJT05fUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiJdfQ==