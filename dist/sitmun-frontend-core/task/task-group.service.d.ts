import { TaskGroup } from './task-group.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Task group manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TaskGroupService extends RestService<TaskGroup> {
    private http;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task group*/
    remove(item: TaskGroup): Observable<Object>;
    /** save task group*/
    save(item: TaskGroup): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TaskGroupService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TaskGroupService>;
}

//# sourceMappingURL=task-group.service.d.ts.map