/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Capabilitie } from './capabilitie.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var CapabilitiesService = /** @class */ (function (_super) {
    tslib_1.__extends(CapabilitiesService, _super);
    /** constructor */
    function CapabilitiesService(injector, http) {
        var _this = _super.call(this, Capabilitie, "helpers/capabilities?url=", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CAPABILITIES_API = 'helpers/capabilities?url=';
        return _this;
    }
    /** save service*/
    /**
     * save service
     * @param {?} url
     * @return {?}
     */
    CapabilitiesService.prototype.getInfo = /**
     * save service
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var result;
        if (url) {
            /** @type {?} */
            var headerDict = {
                'Charset': 'UTF-8'
            };
            /** @type {?} */
            var requestOptions = {
                headers: new HttpHeaders(headerDict),
            };
            /** @type {?} */
            var finalUrl = this.resourceService.getResourceUrl(this.CAPABILITIES_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    };
    CapabilitiesService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    CapabilitiesService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ CapabilitiesService.ngInjectableDef = i0.defineInjectable({ factory: function CapabilitiesService_Factory() { return new CapabilitiesService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: CapabilitiesService, providedIn: "root" });
    return CapabilitiesService;
}(RestService));
export { CapabilitiesService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    CapabilitiesService.prototype.CAPABILITIES_API;
    /** @type {?} */
    CapabilitiesService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwYWJpbGl0aWVzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJjYXBhYmlsaXRpZXMvY2FwYWJpbGl0aWVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7SUFNVCwrQ0FBd0I7SUFLL0Qsa0JBQWtCO0lBQ2xCLDZCQUFZLFFBQWtCLEVBQVMsSUFBZ0I7UUFBdkQsWUFDRSxrQkFBTSxXQUFXLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxDQUFDLFNBQzFEO1FBRnNDLFVBQUksR0FBSixJQUFJLENBQVk7Ozs7aUNBSDdCLDJCQUEyQjs7S0FLcEQ7SUFFQyxrQkFBa0I7Ozs7OztJQUNsQixxQ0FBTzs7Ozs7SUFBUCxVQUFRLEdBQVc7O1FBQ2pCLElBQUksTUFBTSxDQUFxQjtRQUMvQixFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDOztZQUNOLElBQU0sVUFBVSxHQUFHO2dCQUNqQixTQUFTLEVBQUUsT0FBTzthQUNuQixDQUFBOztZQUVELElBQU0sY0FBYyxHQUFHO2dCQUNyQixPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDO2FBQ3JDLENBQUM7O1lBQ0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDMUUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUVmOztnQkEvQkosVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFUb0IsUUFBUTtnQkFDcEIsVUFBVTs7OzhCQURuQjtFQVV5QyxXQUFXO1NBQXZDLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2FwYWJpbGl0aWUgfSBmcm9tICcuL2NhcGFiaWxpdGllLm1vZGVsJztcclxuXHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDYXBhYmlsaXRpZXNTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FwYWJpbGl0aWU+ICB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBDQVBBQklMSVRJRVNfQVBJID0gJ2hlbHBlcnMvY2FwYWJpbGl0aWVzP3VybD0nO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXBhYmlsaXRpZSwgXCJoZWxwZXJzL2NhcGFiaWxpdGllcz91cmw9XCIsIGluamVjdG9yKTtcclxuICB9XHJcblxyXG4gICAgLyoqIHNhdmUgc2VydmljZSovXHJcbiAgICBnZXRJbmZvKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgICBpZih1cmwpe1xyXG4gICAgICAgIGNvbnN0IGhlYWRlckRpY3QgPSB7XHJcbiAgICAgICAgICAnQ2hhcnNldCc6ICdVVEYtOCdcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoaGVhZGVyRGljdCksIFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGZpbmFsVXJsID0gdGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVBBQklMSVRJRVNfQVBJKTtcclxuICAgICAgICBmaW5hbFVybCA9IGZpbmFsVXJsLmNvbmNhdCh1cmwpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZpbmFsVXJsKTtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAuZ2V0KGZpbmFsVXJsLCByZXF1ZXN0T3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuIFxyXG4gICAgfVxyXG4gIFxyXG59XHJcbiJdfQ==