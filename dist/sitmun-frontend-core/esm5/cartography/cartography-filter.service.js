/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { CartographyFilter } from './cartography-filter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * CartographyFilter manager service
 */
var CartographyFilterService = /** @class */ (function (_super) {
    tslib_1.__extends(CartographyFilterService, _super);
    /** constructor */
    function CartographyFilterService(injector, http) {
        var _this = _super.call(this, CartographyFilter, "cartography-filters", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_FILTER_API = 'cartography-filters';
        return _this;
    }
    /** remove cartography filter*/
    /**
     * remove cartography filter
     * @param {?} item
     * @return {?}
     */
    CartographyFilterService.prototype.remove = /**
     * remove cartography filter
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save cartography availability*/
    /**
     * save cartography availability
     * @param {?} item
     * @return {?}
     */
    CartographyFilterService.prototype.save = /**
     * save cartography availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.cartography != null) {
                item.substituteRelation('cartography', item.cartography).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.territorialLevel != null && item.territorialLevel != undefined) {
                item.substituteRelation('territorialLevel', item.territorialLevel).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.cartography = item.cartography._links.self.href;
            item.territorialLevel = item.territorialLevel._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_FILTER_API), item);
        }
        return result;
    };
    CartographyFilterService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyFilterService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyFilterService;
}(RestService));
export { CartographyFilterService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    CartographyFilterService.prototype.CARTOGRAPHY_FILTER_API;
    /** @type {?} */
    CartographyFilterService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydG9ncmFwaHktZmlsdGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJjYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1maWx0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0scUNBQXFDLENBQUM7Ozs7O0lBSWxCLG9EQUE4QjtJQU0xRSxrQkFBa0I7SUFDbEIsa0NBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUF2RCxZQUNFLGtCQUFNLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxTQUMxRDtRQUZzQyxVQUFJLEdBQUosSUFBSSxDQUFZOzs7O3VDQUh2QixxQkFBcUI7O0tBS3BEO0lBRUQsK0JBQStCOzs7Ozs7SUFDL0IseUNBQU07Ozs7O0lBQU4sVUFBTyxJQUF1QjtRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFaEQ7SUFFRCxtQ0FBbUM7Ozs7OztJQUNuQyx1Q0FBSTs7Ozs7SUFBSixVQUFLLElBQXVCOztRQUMxQixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBRyxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUN6QixJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO2lCQUMzRSxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO2FBQ2pDO1lBRUQsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksU0FBVSxDQUFDLENBQUEsQ0FBQztnQkFDdkUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07aUJBQ2pGLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7YUFDbkM7U0FFRjtRQUFDLElBQUksQ0FBQyxDQUFDO1lBRU4sSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JELElBQUksQ0FBQyxnQkFBZ0IsR0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFN0QsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1NBQ2xHO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNmOztnQkF6Q0YsVUFBVTs7OztnQkFOVSxRQUFRO2dCQUNwQixVQUFVOzttQ0FGbkI7RUFROEMsV0FBVztTQUE1Qyx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXJ0b2dyYXBoeUZpbHRlciB9IGZyb20gJy4vY2FydG9ncmFwaHktZmlsdGVyLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogQ2FydG9ncmFwaHlGaWx0ZXIgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUZpbHRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeUZpbHRlcj4ge1xyXG4gIFxyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfRklMVEVSX0FQSSA9ICdjYXJ0b2dyYXBoeS1maWx0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlGaWx0ZXIsIFwiY2FydG9ncmFwaHktZmlsdGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY2FydG9ncmFwaHkgZmlsdGVyKi9cclxuICByZW1vdmUoaXRlbTogQ2FydG9ncmFwaHlGaWx0ZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBhdmFpbGFiaWxpdHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHlGaWx0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgaWYgKGl0ZW0uY2FydG9ncmFwaHkgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjYXJ0b2dyYXBoeScsaXRlbS5jYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoaXRlbS50ZXJyaXRvcmlhbExldmVsICE9IG51bGwgJiYgaXRlbS50ZXJyaXRvcmlhbExldmVsICE9IHVuZGVmaW5lZCApe1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0ZXJyaXRvcmlhbExldmVsJyxpdGVtLnRlcnJpdG9yaWFsTGV2ZWwpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgXHJcbiAgICAgIGl0ZW0uY2FydG9ncmFwaHkgPSBpdGVtLmNhcnRvZ3JhcGh5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0udGVycml0b3JpYWxMZXZlbD1pdGVtLnRlcnJpdG9yaWFsTGV2ZWwuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgICAgXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuQ0FSVE9HUkFQSFlfRklMVEVSX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiJdfQ==