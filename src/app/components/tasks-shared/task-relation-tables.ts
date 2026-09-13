import { firstValueFrom, of } from 'rxjs';

import { DataTableDefinition } from '@app/components/data-tables.util';
import {
  Role,
  RoleService,
  TaskAvailability,
  TaskAvailabilityProjection,
  TaskAvailabilityService,
  TaskGroupService,
  TaskService,
  TerritoryProjection,
  TerritoryService,
} from '@app/domain';
import { onCreate, onDelete, onUpdatedRelation, Status } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { UtilsService } from '@app/services/utils.service';

export interface TaskRelationTableContext {
  dialog: any;
  errorHandler: any;
  loadingService: any;
  utils: UtilsService;
  roleService: RoleService;
  territoryService: TerritoryService;
  taskAvailabilityService: TaskAvailabilityService;
  taskService: TaskService;
  isNew: () => boolean;
  entity: any;
  entityId: number;
  roleTargetToRelation?: (items: Role[]) => Role[];
}

export function createTaskRolesTable(context: TaskRelationTableContext): DataTableDefinition<Role, Role> {
  return DataTableDefinition.builder<Role, Role>(context.dialog, context.errorHandler, context.loadingService)
    .withRelationsColumns([
      context.utils.getSelCheckboxColumnDef(),
      context.utils.getRouterLinkColumnDef('common.form.name', 'name', '/role/:id/roleForm', { id: 'id' }),
      context.utils.getNonEditableColumnDef('common.form.description', 'description'),
      context.utils.getStatusColumnDef(),
    ])
    .withRelationsOrder('name')
    .withRelationsFetcher(() => context.isNew() ? of([]) : context.entity.getRelationArrayEx(Role, 'roles', { projection: 'view' }))
    .withRelationsUpdater(async (roles: (Role & Status)[]) => {
      await onUpdatedRelation(roles).forAll((item) => context.entity.substituteAllRelation('roles', item));
    })
    .withTargetsColumns([
      context.utils.getSelCheckboxColumnDef(),
      context.utils.getNonEditableColumnDef('common.form.name', 'name'),
      context.utils.getNonEditableColumnDef('common.form.description', 'description'),
    ])
    .withTargetsOrder('name')
    .withTargetsFetcher(() => context.roleService.fetchAllItems())
    .withTargetToRelation((items) => context.roleTargetToRelation?.(items) ?? items)
    .withTargetsTitle('entity.task.roles.title')
    .build();
}

export function createTaskAvailabilitiesTable(context: TaskRelationTableContext): DataTableDefinition<TaskAvailabilityProjection, TerritoryProjection> {
  return DataTableDefinition.builder<TaskAvailabilityProjection, TerritoryProjection>(context.dialog, context.errorHandler, context.loadingService)
    .withRelationsColumns([
      context.utils.getSelCheckboxColumnDef(),
      context.utils.getRouterLinkColumnDef('common.form.name', 'territoryName', '/territory/:id/territoryForm', { id: 'territoryId' }),
      context.utils.getNonEditableColumnDef('common.form.code', 'territoryCode'),
      context.utils.getNonEditableColumnDef('common.form.type', 'territoryTypeName'),
      context.utils.getNonEditableDateColumnDef('common.form.created', 'createdDate'),
      context.utils.getStatusColumnDef(),
    ])
    .withRelationsOrder('territoryName')
    .withRelationsFetcher(() => context.isNew() ? of([]) : context.entity.getRelationArrayEx(TaskAvailabilityProjection, 'availabilities', { projection: 'view' }))
    .withRelationsUpdater(async (availabilities: (TaskAvailabilityProjection & Status)[]) => {
      await onDelete(availabilities).forEach((item) => context.taskAvailabilityService.delete(context.taskAvailabilityService.createProxy(item.id)));
      await onCreate(availabilities)
        .map((item) => TaskAvailability.of(context.taskService.createProxy(context.entityId), context.territoryService.createProxy(item.territoryId)))
        .forEach((item) => context.taskAvailabilityService.create(item));
      availabilities.forEach((item) => { item.newItem = false; });
    })
    .withTargetsColumns([
      context.utils.getSelCheckboxColumnDef(),
      context.utils.getNonEditableColumnDef('common.form.name', 'name'),
      context.utils.getNonEditableColumnDef('common.form.code', 'code'),
      context.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
    ])
    .withTargetsOrder('name')
    .withTargetsFetcher(() => context.territoryService.fetchAllProjectionItems(TerritoryProjection))
    .withTargetInclude((availabilities: TaskAvailabilityProjection[]) => (item: TerritoryProjection) => !availabilities.some((availability) => availability.territoryId === item.id))
    .withTargetToRelation((items: TerritoryProjection[]) => items.map((item) => TaskAvailabilityProjection.of(context.entity, item)))
    .withTargetsTitle('entity.task.territories.title')
    .build();
}

export async function updateTaskGroupRelation(entity: any, groupId: unknown, taskGroupService: TaskGroupService): Promise<void> {
  if (typeof groupId === 'number') {
    await firstValueFrom(entity.updateRelationEx('group', taskGroupService.createProxy(groupId)));
  }
}
