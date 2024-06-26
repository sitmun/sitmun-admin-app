/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { CartographyParameter } from './cartography-parameter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Service parameter manager service
 */
var CartographyParameterService = /** @class */ (function (_super) {
    tslib_1.__extends(CartographyParameterService, _super);
    /** constructor */
    function CartographyParameterService(injector, http) {
        var _this = _super.call(this, CartographyParameter, "cartography-parameters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_PARAMETER_API = 'cartography-parameters';
        return _this;
    }
    /** remove service parameter*/
    /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    CartographyParameterService.prototype.remove = /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save service parameter*/
    /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    CartographyParameterService.prototype.save = /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            if (item.cartography != null) {
                /** @type {?} */
                var cartography = item.cartography;
                delete item.cartography;
                item.substituteRelation('cartography', cartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.cartography = item.cartography._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_PARAMETER_API), item);
        }
        return result;
    };
    CartographyParameterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyParameterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyParameterService;
}(RestService));
export { CartographyParameterService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    CartographyParameterService.prototype.CARTOGRAPHY_PARAMETER_API;
    /** @type {?} */
    CartographyParameterService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydG9ncmFwaHktcGFyYW1ldGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJjYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0scUNBQXFDLENBQUM7Ozs7O0lBSWYsdURBQWlDO0lBS2hGLGtCQUFrQjtJQUNsQixxQ0FBWSxRQUFrQixFQUFTLElBQWdCO1FBQXZELFlBQ0Usa0JBQU0sb0JBQW9CLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxDQUFDLFNBQ2hFO1FBRnNDLFVBQUksR0FBSixJQUFJLENBQVk7Ozs7MENBSHBCLHdCQUF3Qjs7S0FLMUQ7SUFFRCw4QkFBOEI7Ozs7OztJQUM5Qiw0Q0FBTTs7Ozs7SUFBTixVQUFPLElBQTBCO1FBQy9CLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFaEQ7SUFFRCw0QkFBNEI7Ozs7OztJQUM1QiwwQ0FBSTs7Ozs7SUFBSixVQUFLLElBQTBCOztRQUM3QixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFFLElBQUksRUFBRTtZQUdyQixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUcsSUFBSSxFQUFDOztnQkFDeEIsSUFBSSxXQUFXLEdBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDcEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07aUJBRXRFLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7YUFDakM7WUFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBR3JEO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFckQsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3JHO1FBQ0QsT0FBTyxNQUFNLENBQUM7S0FDZjs7Z0JBdkNGLFVBQVU7Ozs7Z0JBTlUsUUFBUTtnQkFDcEIsVUFBVTs7c0NBRm5CO0VBUWlELFdBQVc7U0FBL0MsMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FydG9ncmFwaHlQYXJhbWV0ZXIgfSBmcm9tICcuL2NhcnRvZ3JhcGh5LXBhcmFtZXRlci5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFNlcnZpY2UgcGFyYW1ldGVyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpIFxyXG5leHBvcnQgY2xhc3MgQ2FydG9ncmFwaHlQYXJhbWV0ZXJTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8Q2FydG9ncmFwaHlQYXJhbWV0ZXI+IHtcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX1BBUkFNRVRFUl9BUEkgPSAnY2FydG9ncmFwaHktcGFyYW1ldGVycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5UGFyYW1ldGVyLCBcImNhcnRvZ3JhcGh5LXBhcmFtZXRlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlQYXJhbWV0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBzZXJ2aWNlIHBhcmFtZXRlciovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcik6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgICBpZiAoaXRlbS5jYXJ0b2dyYXBoeSAhPW51bGwpe1xyXG4gICAgICAgICAgbGV0IGNhcnRvZ3JhcGh5ID0gIGl0ZW0uY2FydG9ncmFwaHk7XHJcbiAgICAgICAgICBkZWxldGUgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsY2FydG9ncmFwaHkpLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgICAgICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIFxyXG4gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfUEFSQU1FVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiJdfQ==