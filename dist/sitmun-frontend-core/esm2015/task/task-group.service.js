import { TaskGroup } from './task-group.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/** Task group manager service */
export class TaskGroupService extends RestService {
    /** constructor */
    constructor(injector, http) {
        super(TaskGroup, "task-groups", injector);
        this.http = http;
        /** API resource path */
        this.CONNECTION_API = 'task-groups';
    }
    /** remove task group*/
    remove(item) {
        return this.http.delete(item._links.self.href);
    }
    /** save task group*/
    save(item) {
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
TaskGroupService.ɵfac = function TaskGroupService_Factory(t) { return new (t || TaskGroupService)(i0.ɵɵinject(i0.Injector), i0.ɵɵinject(i1.HttpClient)); };
TaskGroupService.ɵprov = i0.ɵɵdefineInjectable({ token: TaskGroupService, factory: TaskGroupService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TaskGroupService, [{
        type: Injectable
    }], function () { return [{ type: i0.Injector }, { type: i1.HttpClient }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1ncm91cC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2Fjb3JvbWluYXMvRGVza3RvcC9OZXh1cy9TaXRtdW4zL3NpdG11bi1mcm9udGVuZC1jb3JlL3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1jb3JlL3NyYy9saWIvIiwic291cmNlcyI6WyJ0YXNrL3Rhc2stZ3JvdXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRWxELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7O0FBRWhFLGlDQUFpQztBQUVqQyxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsV0FBc0I7SUFNMUQsa0JBQWtCO0lBQ2xCLFlBQVksUUFBa0IsRUFBUyxJQUFnQjtRQUNyRCxLQUFLLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQURMLFNBQUksR0FBSixJQUFJLENBQVk7UUFKdkQsd0JBQXdCO1FBQ2pCLG1CQUFjLEdBQUcsYUFBYSxDQUFDO0lBS3RDLENBQUM7SUFFRCx1QkFBdUI7SUFDdkIsTUFBTSxDQUFDLElBQWU7UUFDcEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqRCxDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLElBQUksQ0FBQyxJQUFlO1FBQ2xCLElBQUksTUFBMEIsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUUsSUFBSSxFQUFFO1lBRXJCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckQ7YUFBTTtZQUNMLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUcsSUFBSSxDQUFDLENBQUM7U0FDMUY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOztnRkEzQlUsZ0JBQWdCO3dEQUFoQixnQkFBZ0IsV0FBaEIsZ0JBQWdCO2tEQUFoQixnQkFBZ0I7Y0FENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRhc2tHcm91cCB9IGZyb20gJy4vdGFzay1ncm91cC5tb2RlbCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi4vYW5ndWxhci1oYWwvc3JjL2xpYi9yZXN0LnNlcnZpY2UnO1xyXG5cclxuLyoqIFRhc2sgZ3JvdXAgbWFuYWdlciBzZXJ2aWNlICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhc2tHcm91cFNlcnZpY2UgZXh0ZW5kcyBSZXN0U2VydmljZTxUYXNrR3JvdXA+IHtcclxuICBcclxuXHJcbiAgLyoqIEFQSSByZXNvdXJjZSBwYXRoICovXHJcbiAgcHVibGljIENPTk5FQ1RJT05fQVBJID0gJ3Rhc2stZ3JvdXBzJztcclxuXHJcbiAgLyoqIGNvbnN0cnVjdG9yICovXHJcbiAgY29uc3RydWN0b3IoaW5qZWN0b3I6IEluamVjdG9yLHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgc3VwZXIoVGFza0dyb3VwLCBcInRhc2stZ3JvdXBzXCIsIGluamVjdG9yKTtcclxuICB9XHJcbiAgXHJcbiAgLyoqIHJlbW92ZSB0YXNrIGdyb3VwKi9cclxuICByZW1vdmUoaXRlbTogVGFza0dyb3VwKSB7XHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZShpdGVtLl9saW5rcy5zZWxmLmhyZWYpO1xyXG4gICBcclxuICB9XHJcbiAgXHJcbiAgLyoqIHNhdmUgdGFzayBncm91cCovXHJcbiAgc2F2ZShpdGVtOiBUYXNrR3JvdXApOiBPYnNlcnZhYmxlPGFueT4ge1xyXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTxPYmplY3Q+O1xyXG4gICAgaWYgKGl0ZW0uX2xpbmtzIT1udWxsKSB7XHJcbiAgICAgIFxyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucHV0KGl0ZW0uX2xpbmtzLnNlbGYuaHJlZiwgaXRlbSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmh0dHAucG9zdCh0aGlzLnJlc291cmNlU2VydmljZS5nZXRSZXNvdXJjZVVybCh0aGlzLkNPTk5FQ1RJT05fQVBJKSAsIGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgXHJcbn1cclxuIl19