import { Background } from './background.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Background manager service */
import * as ɵngcc0 from '@angular/core';
export declare class BackgroundService extends RestService<Background> {
    private http;
    /** API resource path */
    BACKGROUND_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove background*/
    remove(item: Background): Observable<Object>;
    /** save background*/
    save(item: Background): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BackgroundService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<BackgroundService>;
}

//# sourceMappingURL=background.service.d.ts.map