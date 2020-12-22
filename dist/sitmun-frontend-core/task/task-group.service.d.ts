import { TaskGroup } from './task-group.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Task group manager service */
export declare class TaskGroupService extends RestService<TaskGroup> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task group*/
    remove(item: TaskGroup): Observable<Object>;
    /** save task group*/
    save(item: TaskGroup): Observable<any>;
}
