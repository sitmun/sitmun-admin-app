import { CartographyGroup } from './cartography-group.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/** CartographyGroup manager service */
export class CartographyGroupService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(CartographyGroup, "cartography-groups", injector);
        this.http = http;
        /** API resource path */
        this.CARTOGRAPHY_GROUP_API = 'cartography-groups';
    }
    /** remove cartography group*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save cartography group*/
    save(item) {
        let result;
        if (item._links != null) {
            result = this.http.put(item._links.self.href, item);
        }
        else {
            result = this.http.post(this.resourceService.getResourceUrl(this.CARTOGRAPHY_GROUP_API), item);
        }
        return result;
    }
}
CartographyGroupService.ɵfac = function CartographyGroupService_Factory(t) { return new (t || CartographyGroupService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
CartographyGroupService.ɵprov = i0.ɵɵdefineInjectable({ token: CartographyGroupService, factory: CartographyGroupService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CartographyGroupService, [{
        type: Injectable
    }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9hY29yb21pbmFzL0Rlc2t0b3AvTmV4dXMvU2l0bXVuMy9zaXRtdW4tZnJvbnRlbmQtY29yZS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtY29yZS9zcmMvbGliLyIsInNvdXJjZXMiOlsiY2FydG9ncmFwaHkvY2FydG9ncmFwaHktZ3JvdXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7QUFFaEUsdUNBQXVDO0FBRXZDLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxXQUE2QjtJQU14RSxrQkFBa0I7SUFDbEIsWUFBWSxRQUFrQixFQUFTLElBQWdCO1FBQ3JELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQURuQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBSnZELHdCQUF3QjtRQUNqQiwwQkFBcUIsR0FBRSxvQkFBb0IsQ0FBQztJQUtuRCxDQUFDO0lBRUQsOEJBQThCO0lBQzlCLE1BQU0sQ0FBQyxJQUFzQjtRQUMzQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpELENBQUM7SUFFRCw0QkFBNEI7SUFDNUIsSUFBSSxDQUFDLElBQXNCO1FBQ3pCLElBQUksTUFBMEIsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUUsSUFBSSxFQUFFO1lBQ3JCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckQ7YUFBTTtZQUNMLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztTQUNqRztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7OzhGQTFCVSx1QkFBdUI7K0RBQXZCLHVCQUF1QixXQUF2Qix1QkFBdUI7a0RBQXZCLHVCQUF1QjtjQURuQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FydG9ncmFwaHlHcm91cCB9IGZyb20gJy4vY2FydG9ncmFwaHktZ3JvdXAubW9kZWwnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDYXJ0b2dyYXBoeUdyb3VwIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDYXJ0b2dyYXBoeUdyb3VwU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENhcnRvZ3JhcGh5R3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENBUlRPR1JBUEhZX0dST1VQX0FQSSA9J2NhcnRvZ3JhcGh5LWdyb3Vwcyc7XHJcblxyXG4gIC8qKiBjb25zdHJ1Y3RvciAqL1xyXG4gIGNvbnN0cnVjdG9yKGluamVjdG9yOiBJbmplY3Rvcixwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgIHN1cGVyKENhcnRvZ3JhcGh5R3JvdXAsIFwiY2FydG9ncmFwaHktZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgcmVtb3ZlKGl0ZW06IENhcnRvZ3JhcGh5R3JvdXApIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjYXJ0b2dyYXBoeSBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBDYXJ0b2dyYXBoeUdyb3VwKTogT2JzZXJ2YWJsZTxhbnk+IHtcclxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGU8T2JqZWN0PjtcclxuICAgIGlmIChpdGVtLl9saW5rcyE9bnVsbCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNBUlRPR1JBUEhZX0dST1VQX0FQSSkgLCBpdGVtKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIFxyXG59XHJcbiJdfQ==