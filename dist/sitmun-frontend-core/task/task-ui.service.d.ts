import { TaskUI } from './task-ui.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Task UI manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TaskUIService extends RestService<TaskUI> {
    private http;
    /** API resource path */
    CONNECTION_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove task UI*/
    remove(item: TaskUI): Observable<Object>;
    /** save task UI*/
    save(item: TaskUI): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TaskUIService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TaskUIService>;
}

//# sourceMappingURL=task-ui.service.d.ts.map