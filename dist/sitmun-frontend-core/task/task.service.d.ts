import { Task } from './task.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Task manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TaskService extends RestService<Task> {
    private http;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task*/
    remove(item: Task): Observable<Object>;
    /** save task*/
    save(item: Task): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TaskService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TaskService>;
}

//# sourceMappingURL=task.service.d.ts.map