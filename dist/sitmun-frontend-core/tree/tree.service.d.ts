import { Tree } from './tree.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Tree manager service */
import * as ɵngcc0 from '@angular/core';
export declare class TreeService extends RestService<Tree> {
    private http;
    /** API resource path */
    TREE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove tree*/
    remove(item: Tree): Observable<Object>;
    /** save tree*/
    save(item: Tree): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TreeService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TreeService>;
}

//# sourceMappingURL=tree.service.d.ts.map