/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Cartography } from './cartography.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Cartography manager service
 */
var CartographyService = /** @class */ (function (_super) {
    tslib_1.__extends(CartographyService, _super);
    /** constructor */
    function CartographyService(injector, http) {
        var _this = _super.call(this, Cartography, "cartographies", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.CARTOGRAPHY_API = 'cartographies';
        return _this;
    }
    /** remove cartography*/
    /**
     * remove cartography
     * @param {?} item
     * @return {?}
     */
    CartographyService.prototype.remove = /**
     * remove cartography
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save cartography*/
    /**
     * save cartography
     * @param {?} item
     * @return {?}
     */
    CartographyService.prototype.save = /**
     * save cartography
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var cartographyConnection = item.connection;
        /** @type {?} */
        var cartographyService = item.service;
        /** @type {?} */
        var cartographySelectionService = item.selectionService;
        if (item.service != null)
            item.service = item.service._links.self.href;
        if (item.selectionService != null)
            item.selectionService = item.selectionService._links.self.href;
        if (item.connection != null) {
            if (typeof item.connection._links != 'undefined') {
                item.connection = item.connection._links.self.href;
            }
            else {
                cartographyConnection._links = {};
                cartographyConnection._links.self = {};
                cartographyConnection._links.self.href = "";
            }
        }
        if (item._links != null) {
            //update relations
            delete item.connection;
            delete item.service;
            delete item.selectionService;
            if (cartographyConnection._links.self.href == '') {
                item.deleteRelation('connection', cartographyConnection).subscribe(function (result) {
                    item.substituteRelation('service', cartographyService).subscribe(function (result) {
                        item.substituteRelation('selectionService', cartographySelectionService).subscribe(function (result) {
                        }, function (error) { return console.error(error); });
                    }, function (error) { return console.error(error); });
                }, function (error) { return console.error(error); });
            }
            else {
                item.substituteRelation('connection', cartographyConnection).subscribe(function (result) {
                    item.substituteRelation('service', cartographyService).subscribe(function (result) {
                        item.substituteRelation('selectionService', cartographySelectionService).subscribe(function (result) {
                        }, function (error) { return console.error(error); });
                    }, function (error) { return console.error(error); });
                }, function (error) { return console.error(error); });
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_API), item);
        }
        return result;
    };
    CartographyService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CartographyService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return CartographyService;
}(RestService));
export { CartographyService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    CartographyService.prototype.CARTOGRAPHY_API;
    /** @type {?} */
    CartographyService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydG9ncmFwaHkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS8iLCJzb3VyY2VzIjpbImNhcnRvZ3JhcGh5L2NhcnRvZ3JhcGh5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7Ozs7SUFJeEIsOENBQXdCO0lBSzlELGtCQUFrQjtJQUNsQiw0QkFBWSxRQUFrQixFQUFTLElBQWdCO1FBQXZELFlBQ0Usa0JBQU0sV0FBVyxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsU0FDOUM7UUFGc0MsVUFBSSxHQUFKLElBQUksQ0FBWTs7OztnQ0FIOUIsZUFBZTs7S0FLdkM7SUFFRCx3QkFBd0I7Ozs7OztJQUN4QixtQ0FBTTs7Ozs7SUFBTixVQUFPLElBQWlCO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUVoRDtJQUVELHNCQUFzQjs7Ozs7O0lBQ3RCLGlDQUFJOzs7OztJQUFKLFVBQUssSUFBaUI7O1FBQ3BCLElBQUksTUFBTSxDQUFxQjs7UUFDL0IsSUFBSSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOztRQUU1QyxJQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O1FBQ3hDLElBQU0sMkJBQTJCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBRzFELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUUsSUFB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SyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7YUFDdEM7WUFFRixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBR3JEO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1NBQzNGO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNmOztnQkE3RUYsVUFBVTs7OztnQkFOVSxRQUFRO2dCQUNwQixVQUFVOzs2QkFGbkI7RUFRd0MsV0FBVztTQUF0QyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXJ0b2dyYXBoeSB9IGZyb20gJy4vY2FydG9ncmFwaHkubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIENhcnRvZ3JhcGh5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeT4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfQVBJID0gJ2NhcnRvZ3JhcGhpZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihDYXJ0b2dyYXBoeSwgXCJjYXJ0b2dyYXBoaWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgY2FydG9ncmFwaHkqL1xyXG4gIHNhdmUoaXRlbTogQ2FydG9ncmFwaHkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgbGV0IGNhcnRvZ3JhcGh5Q29ubmVjdGlvbiA9IGl0ZW0uY29ubmVjdGlvbjtcclxuXHJcbiAgICBjb25zdCBjYXJ0b2dyYXBoeVNlcnZpY2UgPSBpdGVtLnNlcnZpY2U7XHJcbiAgICBjb25zdCBjYXJ0b2dyYXBoeVNlbGVjdGlvblNlcnZpY2UgPSBpdGVtLnNlbGVjdGlvblNlcnZpY2U7XHJcbiAgICBcclxuICAgICAgXHJcbiAgICBpZiAoaXRlbS5zZXJ2aWNlIT1udWxsKVxyXG4gICAgICBpdGVtLnNlcnZpY2UgPSBpdGVtLnNlcnZpY2UuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgIGlmIChpdGVtLnNlbGVjdGlvblNlcnZpY2UhPW51bGwpXHJcbiAgICAgIGl0ZW0uc2VsZWN0aW9uU2VydmljZSA9IGl0ZW0uc2VsZWN0aW9uU2VydmljZS5fbGlua3Muc2VsZi5ocmVmOyAgXHJcbiAgICBpZiAoaXRlbS5jb25uZWN0aW9uIT1udWxsKXtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0uY29ubmVjdGlvbi5fbGlua3MhPSAndW5kZWZpbmVkJykgeyBcclxuICAgICAgICAgICAgaXRlbS5jb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uLl9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FydG9ncmFwaHlDb25uZWN0aW9uLl9saW5rcz0ge307XHJcbiAgICAgICAgICAgIGNhcnRvZ3JhcGh5Q29ubmVjdGlvbi5fbGlua3Muc2VsZiA9IHt9O1xyXG4gICAgICAgICAgICBjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZj1cIlwiO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fbGlua3MhPW51bGwpIHtcclxuICAgICAgICBcclxuICAgICAgLy91cGRhdGUgcmVsYXRpb25zXHJcbiAgICAgIGRlbGV0ZSBpdGVtLmNvbm5lY3Rpb247XHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNlcnZpY2U7ICAgICAgICAgICAgXHJcbiAgICAgIGRlbGV0ZSBpdGVtLnNlbGVjdGlvblNlcnZpY2U7XHJcbiAgICAgIFxyXG4gICAgIGlmIChjYXJ0b2dyYXBoeUNvbm5lY3Rpb24uX2xpbmtzLnNlbGYuaHJlZj09Jycpe1xyXG4gICAgICAgICBpdGVtLmRlbGV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJyxjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4geyAgICAgXHJcbiAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdzZXJ2aWNlJyxjYXJ0b2dyYXBoeVNlcnZpY2UpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlbGVjdGlvblNlcnZpY2UnLGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcbiAgICAgICAgICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdjb25uZWN0aW9uJyxjYXJ0b2dyYXBoeUNvbm5lY3Rpb24pLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlcnZpY2UnLGNhcnRvZ3JhcGh5U2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3NlbGVjdGlvblNlcnZpY2UnLGNhcnRvZ3JhcGh5U2VsZWN0aW9uU2VydmljZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICAgICBcclxuXHJcbiAgICAgIFxyXG4gICAgICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7ICAgICAgICAgICBcclxuICAgICAgIH0gXHJcbiAgICAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcblxyXG4gICAgICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufVxyXG4iXX0=