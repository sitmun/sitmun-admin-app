/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { RestService } from '../angular-hal/src/lib/rest.service';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
/**
 * User manager service
 */
export class UserService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(User, "users", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.USER_API = 'users';
    }
    /**
     * remove user
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save user
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.USER_API, item);
        }
        return result;
    }
    /**
     * change password o given user id
     * @param {?} id
     * @param {?} item
     * @return {?}
     */
    changePassword(id, item) {
        /** @type {?} */
        let result;
        result = this.http.post(this.resourceService.getResourceUrl(this.USER_API + "/" + id + "/change-password"), item);
        return result;
    }
}
UserService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
UserService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    UserService.prototype.USER_API;
    /** @type {?} */
    UserService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsidXNlci91c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUtyRCxNQUFNLGtCQUFtQixTQUFRLFdBQWlCOzs7Ozs7SUFNaEQsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRE0sU0FBSSxHQUFKLElBQUksQ0FBWTs7Ozt3QkFIdEMsT0FBTztLQUt2Qjs7Ozs7O0lBR0QsTUFBTSxDQUFDLElBQVU7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFaEQ7Ozs7OztJQUdELElBQUksQ0FBQyxJQUFTOztRQUNaLElBQUksTUFBTSxDQUFxQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUcsSUFBSSxDQUFDLENBQUM7U0FDL0M7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ2Y7Ozs7Ozs7SUFHRCxjQUFjLENBQUMsRUFBRSxFQUFDLElBQVM7O1FBQ3pCLElBQUksTUFBTSxDQUFxQjtRQUMvQixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBQyxHQUFHLEdBQUMsRUFBRSxHQUFDLGtCQUFrQixDQUFDLEVBQUcsSUFBSSxDQUFDLENBQUM7UUFDN0csTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNmOzs7WUFqQ0YsVUFBVTs7OztZQUpVLFFBQVE7WUFEcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4vdXNlci5tb2RlbCc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbi8qKiBVc2VyIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFVzZXI+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVVNFUl9BUEkgPSd1c2Vycyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFVzZXIsIFwidXNlcnNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHVzZXIqL1xyXG4gIHJlbW92ZShpdGVtOiBVc2VyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdXNlciovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMuVVNFUl9BUEkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gICAgXHJcbiAgLyoqIGNoYW5nZSBwYXNzd29yZCBvIGdpdmVuIHVzZXIgaWQgKi9cclxuICBjaGFuZ2VQYXNzd29yZChpZCxpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgcmVzdWx0ID0gdGhpcy5odHRwLnBvc3QodGhpcy5yZXNvdXJjZVNlcnZpY2UuZ2V0UmVzb3VyY2VVcmwodGhpcy5VU0VSX0FQSStcIi9cIitpZCtcIi9jaGFuZ2UtcGFzc3dvcmRcIikgLCBpdGVtKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==