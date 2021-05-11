import { TreeNode } from './tree-node.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '../angular-hal/src/lib/rest.service';
/** Tree node manager service */
import * as ɵngcc0 from '@angular/core';
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TreeNodeService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<TreeNodeService>;
}

//# sourceMappingURL=tree-node.service.d.ts.map