/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { CartographyParameter } from './cartography-parameter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Service parameter manager service
 */
export class CartographySpatialSelectionParameterService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(CartographyParameter, "cartography-spatial-selection-parameters", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API = 'cartography-spatial-selection-parameters';
    }
    /**
     * remove service parameter
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save service parameter
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            if (item.cartography != null) {
                /** @type {?} */
                let cartography = item.cartography;
                delete item.cartography;
                item.substituteRelation('cartography', cartography).subscribe(result => {
                }, error => console.error(error));
            }
            result = this.http.put(item._links.self.href, item);
        }
        else {
            item.cartography = item.cartography._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API), item);
        }
        return result;
    }
}
CartographySpatialSelectionParameterService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CartographySpatialSelectionParameterService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    CartographySpatialSelectionParameterService.prototype.CARTOGRAPHY_SPATIAL_SELECTION_PARAMETER_API;
    /** @type {?} */
    CartographySpatialSelectionParameterService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJjYXJ0b2dyYXBoeS9jYXJ0b2dyYXBoeS1zcGF0aWFsLXNlbGVjdGlvbi1wYXJhbWV0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDckUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7OztBQUloRSxNQUFNLGtEQUFtRCxTQUFRLFdBQWlDOzs7Ozs7SUFNaEcsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxvQkFBb0IsRUFBRSwwQ0FBMEMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUQ3QyxTQUFJLEdBQUosSUFBSSxDQUFZOzs7OzJEQUhGLDBDQUEwQztLQUs5Rjs7Ozs7O0lBR0QsTUFBTSxDQUFDLElBQTBCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUVoRDs7Ozs7O0lBR0QsSUFBSSxDQUFDLElBQTBCOztRQUM3QixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBR3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUcsSUFBSSxDQUFDLENBQUEsQ0FBQzs7Z0JBQ3pCLElBQUksV0FBVyxHQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ3BDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7aUJBRXpFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakM7WUFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBR3JEO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFckQsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3ZIO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNmOzs7WUF2Q0YsVUFBVTs7OztZQU5VLFFBQVE7WUFDcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcnRvZ3JhcGh5UGFyYW1ldGVyIH0gZnJvbSAnLi9jYXJ0b2dyYXBoeS1wYXJhbWV0ZXIubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBTZXJ2aWNlIHBhcmFtZXRlciBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKSBcclxuZXhwb3J0IGNsYXNzIENhcnRvZ3JhcGh5U3BhdGlhbFNlbGVjdGlvblBhcmFtZXRlclNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxDYXJ0b2dyYXBoeVBhcmFtZXRlcj4ge1xyXG5cclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgQ0FSVE9HUkFQSFlfU1BBVElBTF9TRUxFQ1RJT05fUEFSQU1FVEVSX0FQSSA9ICdjYXJ0b2dyYXBoeS1zcGF0aWFsLXNlbGVjdGlvbi1wYXJhbWV0ZXJzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ2FydG9ncmFwaHlQYXJhbWV0ZXIsIFwiY2FydG9ncmFwaHktc3BhdGlhbC1zZWxlY3Rpb24tcGFyYW1ldGVyc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgc2VydmljZSBwYXJhbWV0ZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBDYXJ0b2dyYXBoeVBhcmFtZXRlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHNlcnZpY2UgcGFyYW1ldGVyKi9cclxuICBzYXZlKGl0ZW06IENhcnRvZ3JhcGh5UGFyYW1ldGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgXHJcbiAgICAgIGlmIChpdGVtLmNhcnRvZ3JhcGh5ICE9bnVsbCl7XHJcbiAgICAgICAgICBsZXQgY2FydG9ncmFwaHkgPSAgaXRlbS5jYXJ0b2dyYXBoeTtcclxuICAgICAgICAgIGRlbGV0ZSBpdGVtLmNhcnRvZ3JhcGh5O1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ2NhcnRvZ3JhcGh5JyxjYXJ0b2dyYXBoeSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgXHJcbiAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbS5jYXJ0b2dyYXBoeSA9IGl0ZW0uY2FydG9ncmFwaHkuX2xpbmtzLnNlbGYuaHJlZjtcclxuICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5DQVJUT0dSQVBIWV9TUEFUSUFMX1NFTEVDVElPTl9QQVJBTUVURVJfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIl19