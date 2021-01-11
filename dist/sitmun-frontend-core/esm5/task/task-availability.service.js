/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { TaskAvailability } from './task-availability.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Task availability manager service
 */
var TaskAvailabilityService = /** @class */ (function (_super) {
    tslib_1.__extends(TaskAvailabilityService, _super);
    /** constructor */
    function TaskAvailabilityService(injector, http) {
        var _this = _super.call(this, TaskAvailability, "task-availabilities", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TASK_AVAILABILITY_API = 'task-availabilities';
        return _this;
    }
    /** remove task availability*/
    /**
     * remove task availability
     * @param {?} item
     * @return {?}
     */
    TaskAvailabilityService.prototype.remove = /**
     * remove task availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save task availability*/
    /**
     * save task availability
     * @param {?} item
     * @return {?}
     */
    TaskAvailabilityService.prototype.save = /**
     * save task availability
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
            if (item.task != null) {
                item.substituteRelation('task', item.task).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
            if (item.territory != null) {
                item.substituteRelation('territory', item.territory).subscribe(function (result) {
                }, function (error) { return console.error(error); });
            }
        }
        else {
            item.territory = item.territory._links.self.href;
            item.task = item.task._links.self.href;
            result = this.http.post(this.resourceService.getResourceUrl(this.TASK_AVAILABILITY_API), item);
        }
        return result;
    };
    TaskAvailabilityService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    TaskAvailabilityService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TaskAvailabilityService;
}(RestService));
export { TaskAvailabilityService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    TaskAvailabilityService.prototype.TASK_AVAILABILITY_API;
    /** @type {?} */
    TaskAvailabilityService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS8iLCJzb3VyY2VzIjpbInRhc2svdGFzay1hdmFpbGFiaWxpdHkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVsRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0scUNBQXFDLENBQUM7Ozs7O0lBSW5CLG1EQUE2QjtJQU14RSxrQkFBa0I7SUFDbEIsaUNBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUF2RCxZQUNFLGtCQUFNLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxTQUN6RDtRQUZzQyxVQUFJLEdBQUosSUFBSSxDQUFZOzs7O3NDQUh4QixxQkFBcUI7O0tBS25EO0lBRUQsOEJBQThCOzs7Ozs7SUFDOUIsd0NBQU07Ozs7O0lBQU4sVUFBTyxJQUFzQjtRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FFaEQ7SUFFRCw0QkFBNEI7Ozs7OztJQUM1QixzQ0FBSTs7Ozs7SUFBSixVQUFLLElBQXNCOztRQUN6QixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBRyxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUNsQixJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO2lCQUU3RCxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO2FBQ2pDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBRyxJQUFJLENBQUMsQ0FBQSxDQUFDO2dCQUN2QixJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNO2lCQUV2RSxFQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFHLElBQUksQ0FBQyxDQUFDO1NBQ2pHO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUNmOztnQkF4Q0YsVUFBVTs7OztnQkFOVSxRQUFRO2dCQUNwQixVQUFVOztrQ0FGbkI7RUFRNkMsV0FBVztTQUEzQyx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUYXNrQXZhaWxhYmlsaXR5IH0gZnJvbSAnLi90YXNrLWF2YWlsYWJpbGl0eS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGFzayBhdmFpbGFiaWxpdHkgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKCkgXHJcbmV4cG9ydCBjbGFzcyBUYXNrQXZhaWxhYmlsaXR5U2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRhc2tBdmFpbGFiaWxpdHk+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIFRBU0tfQVZBSUxBQklMSVRZX0FQSSA9ICd0YXNrLWF2YWlsYWJpbGl0aWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0F2YWlsYWJpbGl0eSwgXCJ0YXNrLWF2YWlsYWJpbGl0aWVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGF2YWlsYWJpbGl0eSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRhc2tBdmFpbGFiaWxpdHkpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0YXNrIGF2YWlsYWJpbGl0eSovXHJcbiAgc2F2ZShpdGVtOiBUYXNrQXZhaWxhYmlsaXR5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICAgIGlmIChpdGVtLnRhc2sgIT1udWxsKXtcclxuICAgICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0YXNrJyxpdGVtLnRhc2spLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdGVtLnRlcnJpdG9yeSAhPW51bGwpe1xyXG4gICAgICAgICAgaXRlbS5zdWJzdGl0dXRlUmVsYXRpb24oJ3RlcnJpdG9yeScsaXRlbS50ZXJyaXRvcnkpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICBcclxuICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpdGVtLnRlcnJpdG9yeSA9IGl0ZW0udGVycml0b3J5Ll9saW5rcy5zZWxmLmhyZWY7XHJcbiAgICAgIGl0ZW0udGFzayA9IGl0ZW0udGFzay5fbGlua3Muc2VsZi5ocmVmO1xyXG4gIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRBU0tfQVZBSUxBQklMSVRZX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiJdfQ==