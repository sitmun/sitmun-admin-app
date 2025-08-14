import { TreeNode } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

/** Tree node manager service */
@Injectable()
export class TreeNodeService extends RestService<TreeNode> {

  /** API resource path */
  public TREE_NODE_API = 'tree-nodes';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
    super(TreeNode, "tree-nodes", injector);
  }

  /** save tree node*/
  save(item: TreeNode): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      const itemTree = item.tree;
      const itemCartography = item.cartography;
      const itemTask = item.task;
      const itemParent = item.parent;

      delete item.tree;
      delete item.cartography;
      delete item.task;
      delete item.parent;

      result = this.http.put(item._links.self.href, item);
      if (itemTree !=null){
          item.substituteRelation('tree',itemTree).subscribe(result => {

          }, error => this.loggerService.error('Error substituting tree relation:', error));
      }
      if (itemCartography !=null){
          item.substituteRelation('cartography',itemCartography).subscribe(result => {

          }, error => this.loggerService.error('Error substituting cartography relation:', error));
      }
      if (itemTask !=null){
        item.substituteRelation('task',itemTask).subscribe(result => {

        }, error => this.loggerService.error('Error substituting task relation:', error));
      }
      if (itemParent !=null){
          item.substituteRelation('parent',itemParent).subscribe(result => {

          }, error => this.loggerService.error('Error substituting parent relation:', error));
      }
      else{
        const treeNodeParent: any = {};
          treeNodeParent._links= {};
          treeNodeParent._links.self = {};
          treeNodeParent._links.self.href="";
          item.deleteRelation('parent', treeNodeParent).subscribe(result => {
        }, error => this.loggerService.error('Error deleting parent relation:', error));
      }

    } else {
      if (item.tree && item.tree._links && item.tree._links.self) {
        item.tree = item.tree._links.self.href;
      }
      if (item.cartography && item.cartography._links && item.cartography._links.self) {
        item.cartography = item.cartography._links.self.href;
      }
      if (item.task && item.task._links && item.task._links.self) {
        item.task = item.task._links.self.href;
      }
      result = this.http.post(this.resourceService.getResourceUrl(this.TREE_NODE_API) , item);
    }
    return result;
  }

}
