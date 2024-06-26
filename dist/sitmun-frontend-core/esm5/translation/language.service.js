/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import { Language } from './language.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var LanguageService = /** @class */ (function (_super) {
    tslib_1.__extends(LanguageService, _super);
    /** constructor */
    function LanguageService(injector, http) {
        var _this = _super.call(this, Language, "languages", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.LANGUAGES_API = 'languages';
        return _this;
    }
    /** remove translation*/
    /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    LanguageService.prototype.remove = /**
     * remove translation
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save translation*/
    /**
     * save translation
     * @param {?} item
     * @return {?}
     */
    LanguageService.prototype.save = /**
     * save translation
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.LANGUAGES_API), item);
        }
        return result;
    };
    LanguageService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    LanguageService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ LanguageService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LanguageService_Factory() { return new LanguageService(i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i1.HttpClient)); }, token: LanguageService, providedIn: "root" });
    return LanguageService;
}(RestService));
export { LanguageService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    LanguageService.prototype.LANGUAGES_API;
    /**
     * @type {?}
     * @private
     */
    LanguageService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS8iLCJzb3VyY2VzIjpbInRyYW5zbGF0aW9uL2xhbmd1YWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7O0FBRzVDO0lBR3FDLDJDQUFxQjtJQUt4RCxrQkFBa0I7SUFDbEIseUJBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUF2RCxZQUNFLGtCQUFNLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLFNBQ3ZDO1FBRnNDLFVBQUksR0FBSixJQUFJLENBQVk7Ozs7UUFIaEQsbUJBQWEsR0FBRyxXQUFXLENBQUM7O0lBS25DLENBQUM7SUFFRCx3QkFBd0I7Ozs7OztJQUN4QixnQ0FBTTs7Ozs7SUFBTixVQUFPLElBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqRCxDQUFDO0lBRUQsc0JBQXNCOzs7Ozs7SUFDdEIsOEJBQUk7Ozs7O0lBQUosVUFBSyxJQUFjOztZQUNiLE1BQTBCO1FBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBRSxJQUFJLEVBQUU7WUFDckIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDthQUFNO1lBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztTQUN6RjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2dCQTVCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQVRvQixRQUFRO2dCQUNwQixVQUFVOzs7MEJBRG5CO0NBb0NDLEFBN0JELENBR3FDLFdBQVcsR0EwQi9DO1NBMUJZLGVBQWU7Ozs7OztJQUcxQix3Q0FBbUM7Ozs7O0lBR0osK0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbmltcG9ydCB7IExhbmd1YWdlIH0gZnJvbSAnLi9sYW5ndWFnZS5tb2RlbCc7XHJcblxyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTGFuZ3VhZ2VTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8TGFuZ3VhZ2U+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIExBTkdVQUdFU19BUEkgPSAnbGFuZ3VhZ2VzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoTGFuZ3VhZ2UsIFwibGFuZ3VhZ2VzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0cmFuc2xhdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IExhbmd1YWdlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdHJhbnNsYXRpb24qL1xyXG4gIHNhdmUoaXRlbTogTGFuZ3VhZ2UpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuTEFOR1VBR0VTX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==