/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Connection } from './connection.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
/**
 * Connection manager service
 */
export class ConnectionService extends RestService {
    /**
     * constructor
     * @param {?} injector
     * @param {?} http
     */
    constructor(injector, http) {
        super(Connection, "connections", injector);
        this.http = http;
        /**
         * API resource path
         */
        this.CONNECTION_API = 'connections';
    }
    /**
     * remove connection
     * @param {?} item
     * @return {?}
     */
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /**
     * save connection
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
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    }
}
ConnectionService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ConnectionService.ctorParameters = () => [
    { type: Injector },
    { type: HttpClient }
];
if (false) {
    /**
     * API resource path
     * @type {?}
     */
    ConnectionService.prototype.CONNECTION_API;
    /** @type {?} */
    ConnectionService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1jb3JlLyIsInNvdXJjZXMiOlsiY29ubmVjdGlvbi9jb25uZWN0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOzs7O0FBSWhFLE1BQU0sd0JBQXlCLFNBQVEsV0FBdUI7Ozs7OztJQU81RCxZQUFZLFFBQWtCLEVBQVMsSUFBZ0I7UUFDckQsS0FBSyxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFETixTQUFJLEdBQUosSUFBSSxDQUFZOzs7OzhCQUgvQixhQUFhO0tBS3BDOzs7Ozs7SUFHRCxNQUFNLENBQUMsSUFBZ0I7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBRWhEOzs7Ozs7SUFHRCxJQUFJLENBQUMsSUFBZ0I7O1FBQ25CLElBQUksTUFBTSxDQUFxQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdEIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztTQUMxRjtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDZjs7O1lBNUJGLFVBQVU7Ozs7WUFOVSxRQUFRO1lBQ3BCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25uZWN0aW9uIH0gZnJvbSAnLi9jb25uZWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gJy4uL2FuZ3VsYXItaGFsL3NyYy9saWIvcmVzdC5zZXJ2aWNlJztcclxuXHJcbi8qKiBDb25uZWN0aW9uIG1hbmFnZXIgc2VydmljZSAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSBleHRlbmRzIFJlc3RTZXJ2aWNlPENvbm5lY3Rpb24+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ2Nvbm5lY3Rpb25zJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoQ29ubmVjdGlvbiwgXCJjb25uZWN0aW9uc1wiLCBpbmplY3Rvcik7XHJcbiAgfVxyXG4gIFxyXG4gIC8qKiByZW1vdmUgY29ubmVjdGlvbiovXHJcbiAgcmVtb3ZlKGl0ZW06IENvbm5lY3Rpb24pIHtcclxuICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKGl0ZW0uX2xpbmtzLnNlbGYuaHJlZik7XHJcbiAgIFxyXG4gIH1cclxuICBcclxuICAvKiogc2F2ZSBjb25uZWN0aW9uKi9cclxuICBzYXZlKGl0ZW06IENvbm5lY3Rpb24pOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIl19