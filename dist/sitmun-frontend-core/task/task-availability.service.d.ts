import { TaskAvailability } from './task-availability.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Task availability manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TaskAvailabilityService extends RestService<TaskAvailability> {
    private http;
    /** API resource path */
    TASK_AVAILABILITY_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task availability*/
    remove(item: TaskAvailability): Observable<Object>;
    /** save task availability*/
    save(item: TaskAvailability): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TaskAvailabilityService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TaskAvailabilityService>;
}

//# sourceMappingURL=task-availability.service.d.ts.map