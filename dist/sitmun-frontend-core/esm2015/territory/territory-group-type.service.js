/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { TerritoryGroupType } from './territory-group-type.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TerritoryGroupTypeService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(TerritoryGroupType, "territory-group-types", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.TERRITORYGROUPTYPE_API = 'territory-group-types';
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
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.TERRITORYGROUPTYPE_API), item);
        }
        return result;
    }
}
TerritoryGroupTypeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
/** @nocollapse */
TerritoryGroupTypeService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
/** @nocollapse */ TerritoryGroupTypeService.ngInjectableDef = i0.defineInjectable({ factory: function TerritoryGroupTypeService_Factory() { return new TerritoryGroupTypeService(i0.inject(i0.INJECTOR), i0.inject(i1.HttpClient)); }, token: TerritoryGroupTypeService, providedIn: "root" });
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    TerritoryGroupTypeService.prototype.TERRITORYGROUPTYPE_API;
    /** @type {?} */
    TerritoryGroupTypeService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycml0b3J5LWdyb3VwLXR5cGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzaXRtdW4vZnJvbnRlbmQtY29yZS8iLCJzb3VyY2VzIjpbInRlcnJpdG9yeS90ZXJyaXRvcnktZ3JvdXAtdHlwZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7QUFJaEUsTUFBTSxnQ0FBaUMsU0FBUSxXQUErQjs7Ozs7O0lBTTVFLFlBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUNyRCxLQUFLLENBQUMsa0JBQWtCLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFEeEIsU0FBSSxHQUFKLElBQUksQ0FBWTs7OztzQ0FIdkIsdUJBQXVCO0tBS3REOzs7Ozs7SUFHRCxNQUFNLENBQUMsSUFBd0I7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBRWhEOzs7Ozs7SUFHRCxJQUFJLENBQUMsSUFBUzs7UUFDWixJQUFJLE1BQU0sQ0FBcUI7UUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckQ7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztTQUNsRztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDZjs7O1lBNUJGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7OztZQU5vQixRQUFRO1lBQ3BCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXJyaXRvcnlHcm91cFR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS1ncm91cC10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5R3JvdXBUeXBlU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPFRlcnJpdG9yeUdyb3VwVHlwZT4ge1xyXG4gIFxyXG4gIC8qKiBBUEkgcmVzb3VyY2UgcGF0aCAqL1xyXG4gIHB1YmxpYyBURVJSSVRPUllHUk9VUFRZUEVfQVBJID0gJ3RlcnJpdG9yeS1ncm91cC10eXBlcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKFRlcnJpdG9yeUdyb3VwVHlwZSwgXCJ0ZXJyaXRvcnktZ3JvdXAtdHlwZXNcIiwgaW5qZWN0b3IpO1xyXG4gIH1cclxuICBcclxuICAvKiogcmVtb3ZlIHRlcnJpdG9yeSovXHJcbiAgcmVtb3ZlKGl0ZW06IFRlcnJpdG9yeUdyb3VwVHlwZSkge1xyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUoaXRlbS5fbGlua3Muc2VsZi5ocmVmKTtcclxuICAgXHJcbiAgfVxyXG4gIFxyXG4gIC8qKiBzYXZlIHRlcnJpdG9yeSovXHJcbiAgc2F2ZShpdGVtOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wdXQoaXRlbS5fbGlua3Muc2VsZi5ocmVmLCBpdGVtKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaHR0cC5wb3N0KHRoaXMucmVzb3VyY2VTZXJ2aWNlLmdldFJlc291cmNlVXJsKHRoaXMuVEVSUklUT1JZR1JPVVBUWVBFX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59Il19