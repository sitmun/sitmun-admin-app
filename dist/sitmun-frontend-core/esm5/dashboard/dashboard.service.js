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
var DashboardService = /** @class */ (function () {
    /** constructor */
    function DashboardService(http, resourceService) {
        this.http = http;
        this.resourceService = resourceService;
        /**
         * API resource path
         */
        this.DASHBOARD_API = 'dashboard/info';
        this.DASHBOARD_EMBEDDED = 'dashboard';
    }
    /** get all kpi */
    /**
     * get all kpi
     * @return {?}
     */
    DashboardService.prototype.getAll = /**
     * get all kpi
     * @return {?}
     */
    function () {
        var _this = this;
        return this.http.get(this.resourceService.getResourceUrl(this.DASHBOARD_API)).map(function (response) { return response[_this.DASHBOARD_EMBEDDED]; });
    };
    DashboardService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    DashboardService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: ResourceService }
    ]; };
    /** @nocollapse */ DashboardService.ngInjectableDef = i0.defineInjectable({ factory: function DashboardService_Factory() { return new DashboardService(i0.inject(i1.HttpClient), i0.inject(i2.ResourceService)); }, token: DashboardService, providedIn: "root" });
    return DashboardService;
}());
export { DashboardService };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJkYXNoYm9hcmQvZGFzaGJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx5Q0FBeUMsQ0FBQzs7Ozs7SUFVcEUsa0JBQWtCO0lBQ2xCLDBCQUNVLE1BQ0E7UUFEQSxTQUFJLEdBQUosSUFBSTtRQUNKLG9CQUFlLEdBQWYsZUFBZTs7Ozs2QkFMRixnQkFBZ0I7a0NBQ1osV0FBVztLQUtyQztJQUVELGtCQUFrQjs7Ozs7SUFDbEIsaUNBQU07Ozs7SUFBTjtRQUFBLGlCQUVDO1FBREMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDO0tBQ2xJOztnQkFqQkosVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFOUSxVQUFVO2dCQUVYLGVBQWU7OzsyQkFIdkI7O1NBUWEsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc291cmNlU2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXNvdXJjZS5zZXJ2aWNlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZFNlcnZpY2V7XHJcblxyXG4gICAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwdWJsaWMgREFTSEJPQVJEX0FQSSA9ICdkYXNoYm9hcmQvaW5mbyc7XHJcbiAgICBwdWJsaWMgREFTSEJPQVJEX0VNQkVEREVEPSAnZGFzaGJvYXJkJztcclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoICAgICAgIFxyXG4gICAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgIHByaXZhdGUgcmVzb3VyY2VTZXJ2aWNlOiBSZXNvdXJjZVNlcnZpY2UpIHtcclxuICAgIH1cclxuICBcclxuICAgIC8qKiBnZXQgYWxsIGtwaSAqL1xyXG4gICAgZ2V0QWxsKCk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuREFTSEJPQVJEX0FQSSkpLm1hcChyZXNwb25zZSA9PiByZXNwb25zZVt0aGlzLkRBU0hCT0FSRF9FTUJFRERFRF0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==