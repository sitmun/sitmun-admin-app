import { Resource } from '@app/core/hal/resource/resource.model';

import { Application, ApplicationProjection } from './application.model';
import { Tree } from '../../tree/models/tree.model';

/**
 * Application tree association model
 */
export class ApplicationTree extends Resource {
  /** id */
  public override id: number;
  public application: Application;
  public tree: Tree;
  public order: number;

  static of(application: Application, tree: Tree, order: number): ApplicationTree {
    const item = new ApplicationTree();
    item.application = application;
    item.tree = tree;
    item.order = order;
    return item;
  }
}

export class ApplicationTreeProjection extends Resource {
  override id: number;
  order: number;
  treeName: string;
  treeId: number;
  treeDescription: string;
  treeType: string;
  applicationName: string;
  applicationId: number;

  static of(
    application: ApplicationProjection,
    tree: Tree,
    order: number
  ): ApplicationTreeProjection {
    const item = new ApplicationTreeProjection();
    item.order = order;
    item.applicationId = application.id;
    item.applicationName = application.name;
    item.treeId = tree.id;
    item.treeName = tree.name;
    item.treeDescription = tree.description;
    item.treeType = tree.type;
    return item;
  }
}
