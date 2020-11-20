import { TreeNode } from './tree-node.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Tree node manager service */
export declare class TreeNodeService extends RestService<TreeNode> {
    private http;
    /** API base path */
    API: string;
    /** API resource path */
    TREE_NODE_API: string;
    /** constructor */
    constructor(injector: Injector, http: HttpClient);
    /** remove tree node*/
    remove(item: TreeNode): Observable<Object>;
    /** save tree node*/
    save(item: TreeNode): Observable<any>;
}
