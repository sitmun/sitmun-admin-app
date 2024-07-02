import { TaskType } from './task-type.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** TaskType manager service */
export declare class TaskTypeService extends RestService<TaskType> {
    private http;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task type*/
    remove(item: TaskType): Observable<Object>;
    /** save task type*/
    save(item: TaskType): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<TaskTypeService, never>;
    static ɵprov: i0.ɵɵInjectableDef<TaskTypeService>;
}
