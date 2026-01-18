import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';

import { Tree } from '../models/tree.model';

/**
 * Request DTO for validating a tree type change against candidate applications.
 * Mirrors the backend TreeTypeValidationRequest DTO.
 */
export interface TreeTypeValidationRequest {
  /** The intended tree type after the change */
  type: string;
  /** The set of application IDs that will be linked to the tree after the change */
  applicationIds: number[];
}

/** Tree manager service */
@Injectable()
export class TreeService extends RestService<Tree> {

  /** API resource path */
  public TREE_API = 'trees';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient) {
    super(Tree, "trees", injector);
  }

  /** save tree*/
  save(item: Tree): Observable<any> {
    if (ResourceHelper.canBeUpdated(item)) {
      return this.update(item);
    }
    return this.create(item);
  }

  /**
   * Validates a tree type change against candidate applications.
   * 
   * This validation is necessary because Spring Data REST requires two separate PUT operations:
   * 1. PUT /api/trees/{id} - updates tree properties (including type)
   * 2. PUT /api/trees/{id}/availableApplications - updates linked applications
   * 
   * Without proactive validation, the first PUT could succeed (type change) and the second PUT
   * could fail (incompatible applications), requiring a rollback that violates REST principles.
   * 
   * @param treeId - The ID of the tree to validate
   * @param type - The intended tree type after the change
   * @param applicationIds - The IDs of applications that will be linked after the change
   * @returns Observable that completes on success (204), or errors on validation failure (422)
   */
  validateTypeChange(treeId: number, type: string, applicationIds: number[]): Observable<void> {
    const url = `${this.resourceService.getResourceUrl(this.TREE_API)}/${treeId}/validate-type-change`;
    const request: TreeTypeValidationRequest = {
      type,
      applicationIds
    };
    return this.http.post<void>(url, request);
  }

}
