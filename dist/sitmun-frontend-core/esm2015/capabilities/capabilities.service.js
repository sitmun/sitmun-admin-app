/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Capabilitie } from './capabilitie.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CapabilitiesService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Capabilitie, "helpers/capabilities?url=", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CAPABILITIES_API = 'helpers/capabilities?url=';
    }
    /**
     * save service
     * @param {?} url
     * @return {?}
     */
    getInfo(url) {
        /** @type {?} */
        let result;
        if (url) {
            /** @type {?} */
            const headerDict = {
                'Charset': 'UTF-8'
            };
            /** @type {?} */
            const requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            /** @type {?} */
            let finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    }
}
CapabilitiesService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
CapabilitiesService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ CapabilitiesService.ngInjectableDef = i0.defineInjectable({ factory: function CapabilitiesService_Factory() { return new CapabilitiesService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: CapabilitiesService, providedIn: "root" });
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    CapabilitiesService.prototype.CAPABILITIES_API;
    /** @type {?} */
    CapabilitiesService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwYWJpbGl0aWVzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJjYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFL0QsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7O0FBTWxELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxXQUF3Qjs7Ozs7O0lBTS9ELFlBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUNyRCxLQUFLLENBQUMsV0FBVyxFQUFFLDJCQUEyQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRHJCLFNBQUksR0FBSixJQUFJLENBQVk7Ozs7Z0NBSDdCLDJCQUEyQjtLQUtwRDs7Ozs7O0lBR0MsT0FBTyxDQUFDLEdBQVc7O1FBQ2pCLElBQUksTUFBTSxDQUFxQjtRQUMvQixJQUFHLEdBQUcsRUFBQzs7WUFDTCxNQUFNLFVBQVUsR0FBRztnQkFDakIsU0FBUyxFQUFFLE9BQU87YUFDbkIsQ0FBQTs7WUFFRCxNQUFNLGNBQWMsR0FBRztnQkFDckIsT0FBTyxFQUFFLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQzthQUNyQyxDQUFDOztZQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFFLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUNsRDtRQUNELE9BQU8sTUFBTSxDQUFDO0tBRWY7OztZQS9CSixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFUb0IsUUFBUTtZQUNwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYXBhYmlsaXRpZSB9IGZyb20gJy4vY2FwYWJpbGl0aWUubW9kZWwnO1xyXG5cclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIENhcGFiaWxpdGllc1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXBhYmlsaXRpZT4gIHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUEFCSUxJVElFU19BUEkgPSAnaGVscGVycy9jYXBhYmlsaXRpZXM/dXJsPSc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcGFiaWxpdGllLCBcImhlbHBlcnMvY2FwYWJpbGl0aWVzP3VybD1cIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICAgIGdldEluZm8odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICAgIGlmKHVybCl7XHJcbiAgICAgICAgY29uc3QgaGVhZGVyRGljdCA9IHtcclxuICAgICAgICAgICdDaGFyc2V0JzogJ1VURi04J1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyhoZWFkZXJEaWN0KSwgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZmluYWxVcmwgPSB0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUEFCSUxJVElFU19BUEkpO1xyXG4gICAgICAgIGZpbmFsVXJsID0gZmluYWxVcmwuY29uY2F0KHVybCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmluYWxVcmwpO1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQoZmluYWxVcmwsIHJlcXVlc3RPcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gXHJcbiAgICB9XHJcbiAgXHJcbn1cclxuIl19