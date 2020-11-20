import { TaskParameter } from './task-parameter.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Task parameter manager service */
export declare class TaskParameterService extends RestService<TaskParameter> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    TASK_PARAMETER_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task parameter*/
    remove(item: TaskParameter): Observable<Object>;
    /** save task parameter*/
    save(item: TaskParameter): Observable<any>;
}
