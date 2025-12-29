import { TreeNode } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

/** Tree node manager service */
@Injectable()
export class TreeNodeService extends RestService<TreeNode> {

  /** API resource path */
  public TREE_NODE_API = 'tree-nodes';

  /** constructor */
  constructor(injector: Injector, private loggerService: LoggerService) {
    super(TreeNode, "tree-nodes", injector);
  }

  /** Create a new tree node
   * Assumes tree, cartography, and task already exist and have _links
   */
  override create(item: TreeNode): Observable<any> {
    if (item.tree) {
      item.tree = item.tree._links.self.href;
    }
    if (item.cartography) {
      item.cartography = item.cartography._links.self.href;
    }
    if (item.task) {
      item.task = item.task._links.self.href;
    }
    return super.create(item);
  }

  /** Update an existing tree node*/
  override update(item: TreeNode): Observable<any> {
    const itemTree = item.tree;
    const itemCartography = item.cartography;
    const itemTask = item.task;
    const itemParent = item.parent;

    delete item.tree;
    delete item.cartography;
    delete item.task;
    delete item.parent;

    const result = super.update(item);
    
    if (itemTree != null) {
      if (itemTree._links && itemTree._links.self) {
        item.substituteRelation('tree', itemTree).subscribe(
          () => {},
          error => this.loggerService.error('Error substituting tree relation:', error)
        );
      } else {
        this.loggerService.warn('TreeNodeService.update - Tree relation does not have _links.self, skipping substitution', {
          treeNodeId: item.id,
          tree: itemTree
        });
      }
    }
    
    if (itemCartography != null) {
      if (itemCartography._links && itemCartography._links.self) {
        item.substituteRelation('cartography', itemCartography).subscribe(
          () => {},
          error => this.loggerService.error('Error substituting cartography relation:', error)
        );
      } else {
        this.loggerService.warn('TreeNodeService.update - Cartography relation does not have _links.self, skipping substitution', {
          treeNodeId: item.id,
          cartography: itemCartography
        });
      }
    }
    
    if (itemTask != null) {
      if (itemTask._links && itemTask._links.self) {
        item.substituteRelation('task', itemTask).subscribe(
          () => {},
          error => this.loggerService.error('Error substituting task relation:', error)
        );
      } else {
        this.loggerService.warn('TreeNodeService.update - Task relation does not have _links.self, skipping substitution', {
          treeNodeId: item.id,
          task: itemTask
        });
      }
    }
    
    if (itemParent != null) {
      if (itemParent._links && itemParent._links.self) {
        item.substituteRelation('parent', itemParent).subscribe(
          () => {},
          error => this.loggerService.error('Error substituting parent relation:', error)
        );
      } else {
        this.loggerService.warn('TreeNodeService.update - Parent relation does not have _links.self, skipping substitution', {
          treeNodeId: item.id,
          parent: itemParent
        });
      }
    } else {
      const treeNodeParent: any = {
        _links: {
          self: {
            href: ""
          }
        }
      };
      item.deleteRelation('parent', treeNodeParent).subscribe(
        () => {},
        error => this.loggerService.error('Error deleting parent relation:', error)
      );
    }

    return result;
  }

  /** Save tree node (routes to create or update)*/
  save(item: TreeNode): Observable<any> {
    if (item._links != null) {
      return this.update(item);
    } else {
      return this.create(item);
    }
  }

}
