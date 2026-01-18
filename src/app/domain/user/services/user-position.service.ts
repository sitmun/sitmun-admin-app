import { Injectable, Injector } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

import { UserPosition } from '../models/user-position.model';

/** User position manager service */
@Injectable()
export class UserPositionService  extends RestService<UserPosition> {


  /** API resource path */
  public USER_POSITION_API = 'user-positions';

  /** constructor */
  constructor(injector: Injector, private loggerService: LoggerService) {
    super(UserPosition, "user-positions", injector);
  }

  /** save user position*/
  save(item: any): Observable<any> {
    if (ResourceHelper.canBeUpdated(item)) {
      const update$ = this.update(item);
      const relationOps = [
        this.applyRelationUpdate(item, 'user', item.user),
        this.applyRelationUpdate(item, 'territory', item.territory)
      ];
      return update$.pipe(
        switchMap(result =>
          forkJoin(relationOps).pipe(map(() => result))
        )
      );
    } else {
      item.territory = ResourceHelper.getSelfHref(item.territory);
      item.user = ResourceHelper.getSelfHref(item.user);
      return this.create(item);
    }
  }

  private applyRelationUpdate(
    item: UserPosition,
    relation: string,
    resource: any
  ): Observable<unknown> {
    if (!resource) {
      return of(null);
    }
    return item.substituteRelation(relation, resource).pipe(
      catchError(error => {
        this.loggerService.error(
          `Error substituting ${relation} relation:`,
          error
        );
        return of(null);
      })
    );
  }

}
