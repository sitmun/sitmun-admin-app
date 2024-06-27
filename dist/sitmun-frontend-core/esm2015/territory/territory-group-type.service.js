import { TerritoryGroupType } from './territory-group-type.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TerritoryGroupTypeService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TerritoryGroupType, "territory-group-types", injector);
        this.http = http;
        /** API resource path */
        this.TERRITORYGROUPTYPE_API = 'territory-group-types';
    }
    /** remove territory*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save territory*/
    save(item) {
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
TerritoryGroupTypeService.ɵfac = function TerritoryGroupTypeService_Factory(t) { return new (t || TerritoryGroupTypeService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
TerritoryGroupTypeService.ɵprov = i0.ɵɵdefineInjectable({ token: TerritoryGroupTypeService, factory: TerritoryGroupTypeService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TerritoryGroupTypeService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVycml0b3J5LWdyb3VwLXR5cGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9hY29yb21pbmFzL0Rlc2t0b3AvTmV4dXMvU2l0bXVuMy9zaXRtdW4tZnJvbnRlbmQtY29yZS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtY29yZS9zcmMvbGliLyIsInNvdXJjZXMiOlsidGVycml0b3J5L3RlcnJpdG9yeS1ncm91cC10eXBlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7O0FBSWhFLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxXQUErQjtJQUs1RSxrQkFBa0I7SUFDbEIsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxrQkFBa0IsRUFBRSx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUR4QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSnZELHdCQUF3QjtRQUNqQiwyQkFBc0IsR0FBRyx1QkFBdUIsQ0FBQztJQUt4RCxDQUFDO0lBRUQsc0JBQXNCO0lBQ3RCLE1BQU0sQ0FBQyxJQUF3QjtRQUM3QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpELENBQUM7SUFFRCxvQkFBb0I7SUFDcEIsSUFBSSxDQUFDLElBQVM7UUFDWixJQUFJLE1BQTBCLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFFLElBQUksRUFBRTtZQUNyQixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUcsSUFBSSxDQUFDLENBQUM7U0FDbEc7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOztrR0F6QlUseUJBQXlCO2lFQUF6Qix5QkFBeUIsV0FBekIseUJBQXlCLG1CQUZ4QixNQUFNO2tEQUVQLHlCQUF5QjtjQUhyQyxVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXJyaXRvcnlHcm91cFR5cGUgfSBmcm9tICcuL3RlcnJpdG9yeS1ncm91cC10eXBlLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1Jlc3RTZXJ2aWNlfSBmcm9tICcuLi9hbmd1bGFyLWhhbC9zcmMvbGliL3Jlc3Quc2VydmljZSc7XHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeUdyb3VwVHlwZVNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUZXJyaXRvcnlHcm91cFR5cGU+IHtcclxuICBcclxuICAvKiogQVBJIHJlc291cmNlIHBhdGggKi9cclxuICBwdWJsaWMgVEVSUklUT1JZR1JPVVBUWVBFX0FQSSA9ICd0ZXJyaXRvcnktZ3JvdXAtdHlwZXMnO1xyXG5cclxuICAvKiogY29uc3RydWN0b3IgKi9cclxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IscHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICBzdXBlcihUZXJyaXRvcnlHcm91cFR5cGUsIFwidGVycml0b3J5LWdyb3VwLXR5cGVzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0ZXJyaXRvcnkqL1xyXG4gIHJlbW92ZShpdGVtOiBUZXJyaXRvcnlHcm91cFR5cGUpIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSB0ZXJyaXRvcnkqL1xyXG4gIHNhdmUoaXRlbTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLlRFUlJJVE9SWUdST1VQVFlQRV9BUEkpICwgaXRlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBcclxufSJdfQ==