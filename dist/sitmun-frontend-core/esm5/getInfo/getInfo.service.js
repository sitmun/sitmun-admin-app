/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Info } from './info.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var GetInfoService = /** @class */ (function (_super) {
    tslib_1.__extends(GetInfoService, _super);
    /** constructor */
    function GetInfoService(injector, http) {
        var _this = _super.call(this, Info, "helpers/feature-type?url=", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.INFO_API = 'helpers/feature-type?url=';
        return _this;
    }
    /** save service*/
    /**
     * save service
     * @param {?} url
     * @return {?}
     */
    GetInfoService.prototype.getInfo = /**
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
            var finalUrl = this.resourceService.getResourceUrl(this.INFO_API);
            finalUrl = finalUrl.concat(url);
            console.log(finalUrl);
            result = this.http.get(finalUrl, requestOptions);
        }
        return result;
    };
    GetInfoService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    GetInfoService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ GetInfoService.ngInjectableDef = i0.defineInjectable({ factory: function GetInfoService_Factory() { return new GetInfoService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: GetInfoService, providedIn: "root" });
    return GetInfoService;
}(RestService));
export { GetInfoService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    GetInfoService.prototype.INFO_API;
    /** @type {?} */
    GetInfoService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0SW5mby5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsiZ2V0SW5mby9nZXRJbmZvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRS9ELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDOzs7O0lBTUEsMENBQWlCO0lBS25ELGtCQUFrQjtJQUNsQix3QkFBWSxRQUFrQixFQUFTLElBQWdCO1FBQXZELFlBQ0Usa0JBQU0sSUFBSSxFQUFFLDJCQUEyQixFQUFFLFFBQVEsQ0FBQyxTQUNuRDtRQUZzQyxVQUFJLEdBQUosSUFBSSxDQUFZOzs7O3lCQUhyQywyQkFBMkI7O0tBSzVDO0lBRUMsa0JBQWtCOzs7Ozs7SUFDbEIsZ0NBQU87Ozs7O0lBQVAsVUFBUSxHQUFXOztRQUNqQixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQzs7WUFDTixJQUFNLFVBQVUsR0FBRztnQkFDakIsU0FBUyxFQUFFLE9BQU87YUFDbkIsQ0FBQTs7WUFFRCxJQUFNLGNBQWMsR0FBRztnQkFDckIsT0FBTyxFQUFFLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQzthQUNyQyxDQUFDOztZQUNGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDbEQ7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0tBRWY7O2dCQS9CSixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQVRvQixRQUFRO2dCQUNwQixVQUFVOzs7eUJBRG5CO0VBVW9DLFdBQVc7U0FBbEMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgSW5mbyB9IGZyb20gJy4vaW5mby5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgR2V0SW5mb1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxJbmZvPiAge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgSU5GT19BUEkgPSAnaGVscGVycy9mZWF0dXJlLXR5cGU/dXJsPSc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKEluZm8sIFwiaGVscGVycy9mZWF0dXJlLXR5cGU/dXJsPVwiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAgIC8qKiBzYXZlIHNlcnZpY2UqL1xyXG4gICAgZ2V0SW5mbyh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgICAgaWYodXJsKXtcclxuICAgICAgICBjb25zdCBoZWFkZXJEaWN0ID0ge1xyXG4gICAgICAgICAgJ0NoYXJzZXQnOiAnVVRGLTgnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0geyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKGhlYWRlckRpY3QpLCBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBmaW5hbFVybCA9IHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuSU5GT19BUEkpO1xyXG4gICAgICAgIGZpbmFsVXJsID0gZmluYWxVcmwuY29uY2F0KHVybCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmluYWxVcmwpO1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5nZXQoZmluYWxVcmwsIHJlcXVlc3RPcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gXHJcbiAgICB9XHJcbiAgXHJcbn1cclxuIl19