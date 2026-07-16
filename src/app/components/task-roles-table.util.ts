import {MatDialog} from '@angular/material/dialog';

import {of} from 'rxjs';

import {DataTableDefinition} from '@app/components/data-tables.util';
import {Role, RoleService, TaskProjection} from '@app/domain';
import {onUpdatedRelation, Status} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {UtilsService} from '@app/services/utils.service';

export interface TaskRolesTableContext {
  readonly dialog: MatDialog;
  readonly errorHandler: ErrorHandlerService;
  readonly loadingService: LoadingOverlayService;
  readonly utils: UtilsService;
  readonly roleService: RoleService;
  getEntityToEdit(): TaskProjection | null;
  isNew(): boolean;
}

export function defineTaskRolesTable(ctx: TaskRolesTableContext): DataTableDefinition<Role, Role> {
  return DataTableDefinition.builder<Role, Role>(ctx.dialog, ctx.errorHandler, ctx.loadingService)
    .withRelationsColumns([
      ctx.utils.getSelCheckboxColumnDef(),
      ctx.utils.getRouterLinkColumnDef('common.form.name', 'name', '/role/:id/roleForm', {id: 'id'}),
      ctx.utils.getNonEditableColumnDef('common.form.description', 'description'),
      ctx.utils.getStatusColumnDef(),
    ])
    .withRelationsOrder('name')
    .withRelationsFetcher(() => {
      if (ctx.isNew()) {
        return of([]);
      }
      return ctx.getEntityToEdit().getRelationArrayEx(Role, 'roles', {projection: 'view'});
    })
    .withRelationsUpdater(async (roles: (Role & Status)[]) => {
      await onUpdatedRelation(roles).forAll(item => ctx.getEntityToEdit().substituteAllRelation('roles', item));
    })
    .withTargetsColumns([
      ctx.utils.getSelCheckboxColumnDef(),
      ctx.utils.getNonEditableColumnDef('common.form.name', 'name'),
      ctx.utils.getNonEditableColumnDef('common.form.description', 'description'),
    ])
    .withTargetsOrder('name')
    .withTargetsFetcher(() => ctx.roleService.fetchAllItems())
    .withTargetToRelation((items) => items)
    .withTargetsTitle('entity.task.roles.title')
    .build();
}
