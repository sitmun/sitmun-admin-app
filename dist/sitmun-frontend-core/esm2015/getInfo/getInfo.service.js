/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GetInfoService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Info, "helpers/getInfo?url=", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.INFO_API = 'helpers/getInfo?url=';
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
            let finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    }
}
GetInfoService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
GetInfoService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ GetInfoService.ngInjectableDef = i0.defineInjectable({ factory: function GetInfoService_Factory() { return new GetInfoService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: GetInfoService, providedIn: "root" });
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    GetInfoService.prototype.INFO_API;
    /** @type {?} */
    GetInfoService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SW5mby5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsiZ2V0SW5mby9nZXRJbmZvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFL0QsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7OztBQU1wQyxNQUFNLHFCQUFzQixTQUFRLFdBQWlCOzs7Ozs7SUFNbkQsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFEVCxTQUFJLEdBQUosSUFBSSxDQUFZOzs7O3dCQUhyQyxzQkFBc0I7S0FLdkM7Ozs7OztJQUdDLE9BQU8sQ0FBQyxHQUFXOztRQUNqQixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQzs7WUFDTixNQUFNLFVBQVUsR0FBRztnQkFDakIsU0FBUyxFQUFFLE9BQU87YUFDbkIsQ0FBQTs7WUFFRCxNQUFNLGNBQWMsR0FBRztnQkFDckIsT0FBTyxFQUFFLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQzthQUNyQyxDQUFDOztZQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDbEQ7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0tBRWY7OztZQS9CSixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFUb0IsUUFBUTtZQUNwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJbmZvIH0gZnJvbSAnLi9pbmZvLm1vZGVsJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHZXRJbmZvU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPEluZm8+ICB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBJTkZPX0FQSSA9ICdoZWxwZXJzL2dldEluZm8/dXJsPSc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEluZm8sIFwiaGVscGVycy9nZXRJbmZvP3VybD1cIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgICAvKiogc2F2ZSBzZXJ2aWNlKi9cclxuICAgIGdldEluZm8odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICAgIGlmKHVybCl7XHJcbiAgICAgICAgY29uc3QgaGVhZGVyRGljdCA9IHtcclxuICAgICAgICAgICdDaGFyc2V0JzogJ1VURi04J1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyhoZWFkZXJEaWN0KSwgXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgZmluYWxVcmwgPSB0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLklORk9fQVBJKTtcclxuICAgICAgICBmaW5hbFVybCA9IGZpbmFsVXJsLmNvbmNhdCh1cmwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZpbmFsVXJsKTtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KGZpbmFsVXJsLCByZXF1ZXN0T3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuIFxyXG4gICAgfVxyXG4gIFxyXG59XHJcbiJdfQ==