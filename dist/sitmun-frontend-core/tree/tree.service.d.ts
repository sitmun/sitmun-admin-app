import { Tree } from './tree.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Tree manager service */
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
    static ɵfac: i0.ɵɵFactoryDef<TreeService, never>;
    static ɵprov: i0.ɵɵInjectableDef<TreeService>;
}
