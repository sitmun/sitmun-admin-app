/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Task } from './task.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Task manager service
 */
export class TaskService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Task, "tasks", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CONNECTION_API = 'tasks';
    }
    /**
     * remove task
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save task
     * @param {?} item
     * @return {?}
     */
    save(item) {
        /** @type {?} */
        let result;
        /** @type {?} */
        const taskType = item.type;
        /** @type {?} */
        const taskGroup = item.group;
        /** @type {?} */
        let taskConnection = item.connection;
        /** @type {?} */
        let taskUI = item.ui;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    }
}
TaskService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TaskService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    TaskService.prototype.CONNECTION_API;
    /** @type {?} */
    TaskService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsidGFzay90YXNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7OztBQUloRSxNQUFNLGtCQUFtQixTQUFRLFdBQWlCOzs7Ozs7SUFNOUMsWUFBWSxRQUFrQixFQUFVLElBQWdCO1FBQ3BELEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBREssU0FBSSxHQUFKLElBQUksQ0FBWTs7Ozs4QkFIaEMsT0FBTztLQUs5Qjs7Ozs7O0lBR0QsTUFBTSxDQUFDLElBQVU7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEQ7Ozs7OztJQUdELElBQUksQ0FBQyxJQUFVOztRQUNYLElBQUksTUFBTSxDQUFxQjs7UUFDL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7UUFDM0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7UUFDN0IsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7UUFDckMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN2RDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzRjtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDakI7OztZQTdCSixVQUFVOzs7O1lBTlUsUUFBUTtZQUNwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4vdGFzay5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBtYW5hZ2VyIHNlcnZpY2UgKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFza1NlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrPiB7XHJcblxyXG4gICAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgICBwdWJsaWMgQ09OTkVDVElPTl9BUEkgPSAndGFza3MnO1xyXG5cclxuICAgIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gICAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICBzdXBlcihUYXNrLCBcInRhc2tzXCIsIGluamVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogcmVtb3ZlIHRhc2sqL1xyXG4gICAgcmVtb3ZlKGl0ZW06IFRhc2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogc2F2ZSB0YXNrKi9cclxuICAgIHNhdmUoaXRlbTogVGFzayk6IE9ic2VydmFibGU8YW55PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgICAgIGNvbnN0IHRhc2tUeXBlID0gaXRlbS50eXBlO1xyXG4gICAgICAgIGNvbnN0IHRhc2tHcm91cCA9IGl0ZW0uZ3JvdXA7XHJcbiAgICAgICAgbGV0IHRhc2tDb25uZWN0aW9uID0gaXRlbS5jb25uZWN0aW9uO1xyXG4gICAgICAgIGxldCB0YXNrVUkgPSBpdGVtLnVpO1xyXG4gICAgICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==