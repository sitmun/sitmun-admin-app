import { TreeNode } from './tree-node.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Tree node manager service */
@Injectable() 
export class TreeNodeService extends RestService<TreeNode> {
  
  /** API resource path */
  public TREE_NODE_API = 'tree-nodes';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(TreeNode, "tree-nodes", injector);
  }
  
  /** remove tree node*/
  remove(item: TreeNode) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save tree node*/
  save(item: TreeNode): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      const itemTree = item.tree;
      const itemCartography = item.cartography;
      const itemParent = item.parent;
        
      delete item.tree;
      delete item.cartography;
      delete item.parent;
        
      result = this.http.put(item._links.self.href, item);
      if (itemTree !=null){
          item.substituteRelation('tree',itemTree).subscribe(result => {
      
          }, error => console.error(error));
      }
      if (itemCartography !=null){
          item.substituteRelation('cartography',itemCartography).subscribe(result => {
      
          }, error => console.error(error));
      }
      if (itemParent !=null){
          item.substituteRelation('parent',itemParent).subscribe(result => {
      
          }, error => console.error(error));
      }
      else{
          let treeNodeParent:any = {};
          treeNodeParent._links= {};
          treeNodeParent._links.self = {};
          treeNodeParent._links.self.href="";
          item.deleteRelation('parent', treeNodeParent).subscribe(result => {
        }, error => console.error(error));
      }
      
    } else {
      if (item.tree && item.tree._links && item.tree._links.self) {
        item.tree = item.tree._links.self.href;
      }
      if (item.cartography && item.cartography._links && item.cartography._links.self) {
        item.cartography = item.cartography._links.self.href;
      }      
      result = this.http.post(this.resourceService.getResourceUrl(this.TREE_NODE_API) , item);
    }
    return result;
  }
  
}
