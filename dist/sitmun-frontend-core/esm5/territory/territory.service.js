/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Territory } from './territory.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Territory manager service
 */
var TerritoryService = /** @class */ (function (_super) {
    tslib_1.__extends(TerritoryService, _super);
    /** constructor */
    function TerritoryService(injector, http) {
        var _this = _super.call(this, Territory, "territories", injector) || this;
        _this.http = http;
        /**
         * API resource path
         */
        _this.TERRITORY_API = 'territories';
        return _this;
    }
    /** remove territory*/
    /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    TerritoryService.prototype.remove = /**
     * remove territory
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return this.http.delete(item._links.self.href);
    };
    /** save territory*/
    /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    TerritoryService.prototype.save = /**
     * save territory
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var result;
        /** @type {?} */
        var territoryGroupType = {};
        territoryGroupType._links = {};
        territoryGroupType._links.self = {};
        territoryGroupType._links.self.href = "";
        /** @type {?} */
        var territoryType = {};
        territoryType._links = {};
        territoryType._links.self = {};
        territoryType._links.self.href = "";
        if (item.type != null) {
            territoryType = item.type;
            if (typeof item.type._links != 'undefined') {
                item.type = item.type._links.self.href;
            }
        }
        if (item._links != null) {
            //update relations
            delete item.groupType;
            // if (territoryGroupType._links.self.href == '') {
            //   item.deleteRelation('groupType', territoryGroupType).subscribe(result => {
            //   }, error => console.error(error));
            // } else {
            //   item.substituteRelation('groupType', territoryGroupType).subscribe(result => {
            //   }, error => console.error(error));
            // }
            if (territoryType._links.self.href == '') {
                item.deleteRelation('type', territoryType).subscribe((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                }), (/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) { return console.error(error); }));
            }
            else {
                item.substituteRelation('type', territoryType).subscribe((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                }), (/**
                 * @param {?} error
                 * @return {?}
                 */
                function (error) { return console.error(error); }));
            }
            delete item.type;
            // if (item.type != null)
            //   item.type = item.type._links.self.href;
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORY_API), item);
        }
        return result;
    };
    TerritoryService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    TerritoryService.ctorParameters = function () { return [
        { type: Injector },
        { type: HttpClient }
    ]; };
    return TerritoryService;
}(RestService));
export { TerritoryService };
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    TerritoryService.prototype.TERRITORY_API;
    /**
     * @type {?}
     * @private
     */
    TerritoryService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycml0b3J5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2l0bXVuL2Zyb250ZW5kLWNvcmUvIiwic291cmNlcyI6WyJ0ZXJyaXRvcnkvdGVycml0b3J5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQzs7OztBQUdsRTtJQUNzQyw0Q0FBc0I7SUFLMUQsa0JBQWtCO0lBQ2xCLDBCQUFZLFFBQWtCLEVBQVUsSUFBZ0I7UUFBeEQsWUFDRSxrQkFBTSxTQUFTLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxTQUMxQztRQUZ1QyxVQUFJLEdBQUosSUFBSSxDQUFZOzs7O1FBSGpELG1CQUFhLEdBQUcsYUFBYSxDQUFDOztJQUtyQyxDQUFDO0lBRUQsc0JBQXNCOzs7Ozs7SUFDdEIsaUNBQU07Ozs7O0lBQU4sVUFBTyxJQUFlO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakQsQ0FBQztJQUVELG9CQUFvQjs7Ozs7O0lBQ3BCLCtCQUFJOzs7OztJQUFKLFVBQUssSUFBZTs7WUFDZCxNQUEwQjs7WUFFMUIsa0JBQWtCLEdBQU8sRUFBRTtRQUMvQixrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQy9CLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3BDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7WUFFckMsYUFBYSxHQUFPLEVBQUU7UUFDMUIsYUFBYSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDMUIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQy9CLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFFcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtZQUNyQixhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFFO2dCQUMxQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDeEM7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDdkIsa0JBQWtCO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUd0QixtREFBbUQ7WUFDbkQsK0VBQStFO1lBQy9FLHVDQUF1QztZQUV2QyxXQUFXO1lBQ1gsbUZBQW1GO1lBQ25GLHVDQUF1QztZQUN2QyxJQUFJO1lBRUosSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxTQUFTOzs7O2dCQUFDLFVBQUEsTUFBTTtnQkFDM0QsQ0FBQzs7OztnQkFBRSxVQUFBLEtBQUssSUFBSSxPQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQXBCLENBQW9CLEVBQUMsQ0FBQzthQUVuQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLFNBQVM7Ozs7Z0JBQUMsVUFBQSxNQUFNO2dCQUMvRCxDQUFDOzs7O2dCQUFFLFVBQUEsS0FBSyxJQUFJLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBcEIsQ0FBb0IsRUFBQyxDQUFDO2FBQ25DO1lBRUQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2pCLHlCQUF5QjtZQUN6Qiw0Q0FBNEM7WUFFNUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDthQUFNO1lBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN4RjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2dCQXRFRixVQUFVOzs7O2dCQU5VLFFBQVE7Z0JBQ3BCLFVBQVU7O0lBNkVuQix1QkFBQztDQUFBLEFBeEVELENBQ3NDLFdBQVcsR0F1RWhEO1NBdkVZLGdCQUFnQjs7Ozs7O0lBRzNCLHlDQUFxQzs7Ozs7SUFHTCxnQ0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXJyaXRvcnkgfSBmcm9tICcuL3RlcnJpdG9yeS5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgUmVzdFNlcnZpY2UgfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcblxyXG4vKiogVGVycml0b3J5IG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnlTZXJ2aWNlIGV4dGVuZHMgUmVzdFNlcnZpY2U8VGVycml0b3J5PiB7XHJcblxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllfQVBJID0gJ3RlcnJpdG9yaWVzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeSwgXCJ0ZXJyaXRvcmllc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG5cclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkqL1xyXG4gIHNhdmUoaXRlbTogVGVycml0b3J5KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuXHJcbiAgICBsZXQgdGVycml0b3J5R3JvdXBUeXBlOmFueSA9IHt9XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzID0ge307XHJcbiAgICB0ZXJyaXRvcnlHcm91cFR5cGUuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZi5ocmVmID0gXCJcIjtcclxuXHJcbiAgICBsZXQgdGVycml0b3J5VHlwZTphbnkgPSB7fVxyXG4gICAgdGVycml0b3J5VHlwZS5fbGlua3MgPSB7fTtcclxuICAgIHRlcnJpdG9yeVR5cGUuX2xpbmtzLnNlbGYgPSB7fTtcclxuICAgIHRlcnJpdG9yeVR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9IFwiXCI7XHJcblxyXG4gICAgaWYgKGl0ZW0udHlwZSAhPSBudWxsKSB7XHJcbiAgICAgIHRlcnJpdG9yeVR5cGUgPSBpdGVtLnR5cGU7XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbS50eXBlLl9saW5rcyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGl0ZW0udHlwZSA9IGl0ZW0udHlwZS5fbGlua3Muc2VsZi5ocmVmO1xyXG4gICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9saW5rcyAhPSBudWxsKSB7XHJcbiAgICAgIC8vdXBkYXRlIHJlbGF0aW9uc1xyXG4gICAgICBkZWxldGUgaXRlbS5ncm91cFR5cGU7XHJcblxyXG5cclxuICAgICAgLy8gaWYgKHRlcnJpdG9yeUdyb3VwVHlwZS5fbGlua3Muc2VsZi5ocmVmID09ICcnKSB7XHJcbiAgICAgIC8vICAgaXRlbS5kZWxldGVSZWxhdGlvbignZ3JvdXBUeXBlJywgdGVycml0b3J5R3JvdXBUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgLy8gICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAvLyAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCdncm91cFR5cGUnLCB0ZXJyaXRvcnlHcm91cFR5cGUpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAvLyAgIH0sIGVycm9yID0+IGNvbnNvbGUuZXJyb3IoZXJyb3IpKTtcclxuICAgICAgLy8gfVxyXG5cclxuICAgICAgaWYgKHRlcnJpdG9yeVR5cGUuX2xpbmtzLnNlbGYuaHJlZiA9PSAnJykge1xyXG4gICAgICAgIGl0ZW0uZGVsZXRlUmVsYXRpb24oJ3R5cGUnLCB0ZXJyaXRvcnlUeXBlKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICB9LCBlcnJvciA9PiBjb25zb2xlLmVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uc3Vic3RpdHV0ZVJlbGF0aW9uKCd0eXBlJywgdGVycml0b3J5VHlwZSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgfSwgZXJyb3IgPT4gY29uc29sZS5lcnJvcihlcnJvcikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWxldGUgaXRlbS50eXBlO1xyXG4gICAgICAvLyBpZiAoaXRlbS50eXBlICE9IG51bGwpXHJcbiAgICAgIC8vICAgaXRlbS50eXBlID0gaXRlbS50eXBlLl9saW5rcy5zZWxmLmhyZWY7XHJcblxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWV9BUEkpLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=