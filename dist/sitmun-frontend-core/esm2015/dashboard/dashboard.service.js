/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from '../angular-hal/src/lib/resource.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../angular-hal/src/lib/resource.service";
export class DashboardService {
    /**
     * constructor
     * @param {?} http
     * @param {?} resourceService
     */
    constructor(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /**
         * API resource path
         */
        this.DASHBOARD_API = 'dashboard/info';
        this.DASHBOARD_EMBEDDED = 'dashboard';
    }
    /**
     * get all kpi
     * @return {?}
     */
    getAll() {
        return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(response => response[this.DASHBOARD_EMBEDDED]);
    }
}
DashboardService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
DashboardService.ctorParameters = () => [
    { type: HttpClient },
    { type: ResourceService }
];
/** @nocollapse */ DashboardService.ngInjectableDef = i0.defineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(i0.inject(i1.HttpClient), i0.inject(i2.ResourceService)); }, token: DashboardService, providedIn: "root" });
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    DashboardService.prototype.DASHBOARD_API;
    /** @type {?} */
    DashboardService.prototype.DASHBOARD_EMBEDDED;
    /** @type {?} */
    DashboardService.prototype.http;
    /** @type {?} */
    DashboardService.prototype.resourceService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJkYXNoYm9hcmQvZGFzaGJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQzs7OztBQUt4RSxNQUFNLE9BQU8sZ0JBQWdCOzs7Ozs7SUFNekIsWUFDVSxNQUNBO1FBREEsU0FBSSxHQUFKLElBQUk7UUFDSixvQkFBZSxHQUFmLGVBQWU7Ozs7NkJBTEYsZ0JBQWdCO2tDQUNaLFdBQVc7S0FLckM7Ozs7O0lBR0QsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7S0FDbEk7OztZQWpCSixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFOUSxVQUFVO1lBRVgsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXNvdXJjZVNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzb3VyY2Uuc2VydmljZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmRTZXJ2aWNle1xyXG5cclxuICAgIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gICAgcHVibGljIERBU0hCT0FSRF9BUEkgPSAnZGFzaGJvYXJkL2luZm8nO1xyXG4gICAgcHVibGljIERBU0hCT0FSRF9FTUJFRERFRD0gJ2Rhc2hib2FyZCc7XHJcbiAgICAvKiogY29uc3RydWN0b3IgKi9cclxuICAgIGNvbnN0cnVjdG9yKCAgICAgICBcclxuICAgICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICBwcml2YXRlIHJlc291cmNlU2VydmljZTogUmVzb3VyY2VTZXJ2aWNlKSB7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKiogZ2V0IGFsbCBrcGkgKi9cclxuICAgIGdldEFsbCgpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkRBU0hCT0FSRF9BUEkpKS5tYXAocmVzcG9uc2UgPT4gcmVzcG9uc2VbdGhpcy5EQVNIQk9BUkRfRU1CRURERURdKTtcclxuICAgIH1cclxufVxyXG4iXX0=