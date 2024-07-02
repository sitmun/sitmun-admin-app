import { TreeNode } from './tree-node.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
import * as i0 from "@angular/core";
/** Tree node manager service */
export declare class TreeNodeService extends RestService<TreeNode> {
    private http;
    /** API resource path */
    TREE_NODE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove tree node*/
    remove(item: TreeNode): Observable<Object>;
    /** save tree node*/
    save(item: TreeNode): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<TreeNodeService, never>;
    static ɵprov: i0.ɵɵInjectableDef<TreeNodeService>;
}
