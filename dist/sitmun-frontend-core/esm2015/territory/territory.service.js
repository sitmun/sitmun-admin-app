/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Territory } from './territory.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Territory manager service
 */
export class TerritoryService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Territory, "territories", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.TERRITORY_API = 'territories';
    }
    /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item.type != null)
            item.type = item.type._links.self.href;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORY_API), item);
        }
        return result;
    }
}
TerritoryService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TerritoryService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    TerritoryService.prototype.TERRITORY_API;
    /** @type {?} */
    TerritoryService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycml0b3J5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJ0ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7O0FBSWhFLE1BQU0sdUJBQXdCLFNBQVEsV0FBc0I7Ozs7OztJQU0xRCxZQUFZLFFBQWtCLEVBQVMsSUFBZ0I7UUFDckQsS0FBSyxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFETCxTQUFJLEdBQUosSUFBSSxDQUFZOzs7OzZCQUhoQyxhQUFhO0tBS25DOzs7Ozs7SUFHRCxNQUFNLENBQUMsSUFBZTtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFaEQ7Ozs7OztJQUdELElBQUksQ0FBQyxJQUFlOztRQUNsQixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBRSxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV0QixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JEO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3pGO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNmOzs7WUE3QkYsVUFBVTs7OztZQU5VLFFBQVE7WUFDcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlcnJpdG9yeSB9IGZyb20gJy4vdGVycml0b3J5Lm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBUZXJyaXRvcnkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnk+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZX0FQSSA9ICd0ZXJyaXRvcmllcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeSwgXCJ0ZXJyaXRvcmllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgdGVycml0b3J5Ki9cclxuICByZW1vdmUoaXRlbTogVGVycml0b3J5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGVycml0b3J5Ki9cclxuICBzYXZlKGl0ZW06IFRlcnJpdG9yeSk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICBsZXQgcmVzdWx0OiBPYnNlcnZhYmxlPE9iamVjdD47XHJcbiAgICBpZiAoaXRlbS50eXBlIT1udWxsKVxyXG4gICAgICBpdGVtLnR5cGUgPSBpdGVtLnR5cGUuX2xpbmtzLnNlbGYuaHJlZjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICBcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnB1dChpdGVtLl9saW5rcy5zZWxmLmhyZWYsIGl0ZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5URVJSSVRPUllfQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIl19