import { Injectable, Injector } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

import { TreeNode } from '../models/tree-node.model';

/** Tree node manager service */
@Injectable()
export class TreeNodeService extends RestService<TreeNode> {

  /** API resource path */
  public TREE_NODE_API = 'tree-nodes';

  /** constructor */
  constructor(injector: Injector, private loggerService: LoggerService) {
    super(TreeNode, "tree-nodes", injector);
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

    return super.update(item).pipe(
      switchMap(updated =>
        this.ensureRelationLinks(updated, ['tree', 'cartography', 'task', 'parent']).pipe(
          switchMap(target => {
            const relationOps = [
              this.applyRelationUpdate(target, 'tree', itemTree, {
                treeNodeId: updated.id,
                tree: itemTree
              }),
              this.applyRelationUpdate(target, 'cartography', itemCartography, {
                treeNodeId: updated.id,
                cartography: itemCartography
              }),
              this.applyRelationUpdate(target, 'task', itemTask, {
                treeNodeId: updated.id,
                task: itemTask
              }),
              this.applyParentUpdate(target, itemParent)
            ];

            return forkJoin(relationOps).pipe(map(() => updated));
          })
        )
      )
    );
  }

  /**
   * Ensures relation links are present before relation updates.
   * If any requested relation link is missing, fetches the resource.
   */
  private ensureRelationLinks(
    target: TreeNode,
    relations: string[]
  ): Observable<TreeNode> {
    if (!target?.id) {
      return of(target);
    }
    const missing = relations.some(relation => !target._links?.[relation]?.href);
    if (!missing) {
      return of(target);
    }
    return this.get(target.id).pipe(
      catchError(error => {
        this.loggerService.warn(
          'TreeNodeService.update - Unable to load relation links, proceeding with available links',
          { treeNodeId: target.id, error }
        );
        return of(target);
      })
    );
  }

  private applyRelationUpdate(
    target: TreeNode,
    relation: string,
    resource: any,
    context: Record<string, unknown>
  ): Observable<unknown> {
    if (!resource) {
      return of(null);
    }
    if (!ResourceHelper.canBeUpdated(resource)) {
      this.loggerService.warn(
        `TreeNodeService.update - ${relation} relation does not have _links.self, skipping substitution`,
        context
      );
      return of(null);
    }
    return target.substituteRelation(relation, resource).pipe(
      catchError(error => {
        this.loggerService.error(
          `Error substituting ${relation} relation:`,
          error
        );
        return of(null);
      })
    );
  }

  private applyParentUpdate(
    target: TreeNode,
    parent: any
  ): Observable<unknown> {
    if (parent == null) {
      return target.updateRelationEx('parent', null).pipe(
        catchError(error => {
          this.loggerService.error(
            'Error deleting parent relation:',
            error
          );
          return of(null);
        })
      );
    }
    return this.applyRelationUpdate(target, 'parent', parent, {
      treeNodeId: target.id,
      parent: parent
    });
  }

  /** Save tree node (routes to create or update)*/
  save(item: TreeNode): Observable<any> {
    this.ensureSelfLink(item);
    if (ResourceHelper.canBeUpdated(item)) {
      return this.update(item);
    } else {
      return this.create(item);
    }
  }

  /** Deletes a tree node by id */
  deleteById(id: number): Observable<any> {
    const proxy = this.createProxy(id);
    if (!proxy) {
      return of(null);
    }
    return this.delete(proxy);
  }

  private ensureSelfLink(item: TreeNode): void {
    if (ResourceHelper.canBeUpdated(item)) {
      return;
    }
    if (item?.id == null || item.id < 0) {
      return;
    }
    const proxy = this.createProxy(item.id);
    if (proxy?._links) {
      item._links = proxy._links;
    }
  }

}
