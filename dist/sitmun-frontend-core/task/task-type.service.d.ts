import { TaskType } from './task-type.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** TaskType manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TaskTypeService extends RestService<TaskType> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task type*/
    remove(item: TaskType): Observable<Object>;
    /** save task type*/
    save(item: TaskType): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TaskTypeService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TaskTypeService>;
}

//# sourceMappingURL=task-type.service.d.ts.map