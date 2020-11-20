import { Tree } from './tree.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Tree manager service */
export declare class TreeService extends RestService<Tree> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    TREE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove tree*/
    remove(item: Tree): Observable<Object>;
    /** save tree*/
    save(item: Tree): Observable<any>;
}
