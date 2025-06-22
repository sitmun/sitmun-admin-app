import { Component } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RoleService,
  Role,
  UserService,
  CartographyGroupService,
  TaskService,
  TaskProjection,
  UserConfigurationService,
  TerritoryService,
  User,
  TerritoryProjection,
  ApplicationService,
  Application,
  TranslationService,
  CodeListService,
  UserConfigurationProjection,
  UserConfiguration,
} from '@app/domain';
import { UtilsService } from '@app/services/utils.service';
import { firstValueFrom, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { Status, onUpdate, onDelete, onCreate, onUpdatedRelation } from '@app/frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { LoggerService } from '@app/services/logger.service';
import { BaseFormComponent } from '@app/components/base-form.component';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { DataTable2Definition, DataTableDefinition } from '@app/components/data-tables.util';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styles: []
})
export class RoleFormComponent extends BaseFormComponent<Role> {

  /**
   * Data table configuration for managing application parameters.
   * Provides CRUD operations for parameters with validation and type management.
   * Columns: checkbox, name (editable), value (editable), type (non-editable), status
   */
  readonly applicationsTable: DataTableDefinition<Application, Application>

  readonly tasksTable: DataTableDefinition<TaskProjection, TaskProjection>

  readonly userConfigurationsTable: DataTable2Definition<UserConfigurationProjection, User, TerritoryProjection>

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    private roleService: RoleService,
    public cartographyGroupService: CartographyGroupService,
    public tasksService: TaskService,
    public applicationService: ApplicationService,
    public userConfigurationsService: UserConfigurationService,
    public userService: UserService,
    public territoryService: TerritoryService,
    public utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.applicationsTable = this.defineApplicationsTable();
    this.tasksTable = this.defineTasksTable();
    this.userConfigurationsTable = this.defineUserConfigurationsTable();
  }

  /**
   * Initializes component data before fetching.
   * Sets up data tables, translations, and situation map list.
   */
  override async preFetchData() {
    this.dataTables.register(this.applicationsTable).register(this.tasksTable).register(this.userConfigurationsTable);
  }

    /**
   * Fetches the original entity by ID.
   * @returns Promise of Role
   */
    override fetchOriginal(): Promise<Role> {
      return firstValueFrom(this.roleService.get(this.entityID));
    }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of duplicated Role entity
   */
  override fetchCopy(): Promise<Role> {
    return firstValueFrom(this.roleService.get(this.duplicateID).pipe(map((copy: Role) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty entity with default values.
   * @returns New Role instance.
   */
    override empty(): Role {
      return new Role()
    }

 /**
   * Initializes form data after entity is fetched.
   * Sets up reactive form with entity values and validation rules.
   * @throws Error if entity is undefined
   */
 override postFetchData() {
  if (!this.entityToEdit) {
    throw new Error('Cannot initialize form: entity is undefined');
  }
  this.entityForm = new UntypedFormGroup({
    name: new UntypedFormControl(this.entityToEdit.name, [Validators.required,]),
    description: new UntypedFormControl(this.entityToEdit.description),
  });
}

  /**
   * Creates an Role object from the current form values.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Role instance populated with form values
   */
  createObject(id: number = null): Role {
    return Role.fromObject(this.entityToEdit);
  }

  /**
   * Creates a new entity or duplicates an existing one.
   * @returns Promise of created entity ID
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.roleService.create(entityToCreate));
    return response.id;
  }

  /**
   * Updates an existing entity with form values.
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.roleService.update(entityToUpdate));
  }

  /**
   * Validates if the form is valid.
   * @returns boolean indicating form validity
   */
  validForm(): boolean {
    return this.entityForm.valid;

  }


  private defineUserConfigurationsTable(): DataTable2Definition<UserConfigurationProjection, User, TerritoryProjection> {
    return DataTable2Definition.builder<UserConfigurationProjection, User, TerritoryProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('entity.role.users.user', 'user', '/user/:id/userForm', {id: 'userId'}),
        this.utils.getRouterLinkColumnDef('entity.role.users.territory', 'territory', '/territory/:id/territoryForm', {id: 'territoryId'}),
        this.utils.getNonEditableColumnDef('entity.role.users.appliesToChildrenTerritories', 'appliesToChildrenTerritories'),
        this.utils.getDateColumnDef('entity.role.users.createdDate', 'createdDate', false),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        return this.entityToEdit.getRelationArrayEx(UserConfigurationProjection, 'userConfigurations', {projection: 'view'})
      })
      .withFieldRestrictions(['userId', 'territoryId'])
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('entity.role.users.user.title', 'user', '/user/:id/userForm', {id: 'userId'}),
        this.utils.getRouterLinkColumnDef('entity.role.users.territory.title', 'territory', '/territory/:id/territoryForm', {id: 'territoryId'}),
        this.utils.getBooleanColumnDef('entity.role.users.appliesToChildrenTerritories', 'appliesToChildrenTerritories', true),
        this.utils.getDateColumnDef('entity.role.users.createdDate', 'createdDate', false),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsUpdater(async (userConfigurations: (UserConfigurationProjection & Status)[]) => {
        await onCreate(userConfigurations).forEach(item => {
          const newItem = UserConfiguration.fromObject(item);
          newItem.user = this.userService.createProxy(item.userId);
          newItem.territory = this.territoryService.createProxy(item.territoryId);
          newItem.role = this.roleService.createProxy(item.roleId);
          return this.userConfigurationsService.create(newItem);
        });
        await onUpdate(userConfigurations).forEach(item => {
          const newItem = UserConfiguration.fromObject(item);
          delete newItem.user;
          delete newItem.territory;
          delete newItem.role;
          return this.userConfigurationsService.update(newItem);
        }
        );
        await onDelete(userConfigurations).forEach(item => {
          const newItem = this.userConfigurationsService.createProxy(item.id)
          return this.userConfigurationsService.delete(newItem);
        });
      })
      .withTargetToRelation((users: User[], territories: TerritoryProjection[]) => {
        const relations: UserConfigurationProjection[] = [];
        territories.forEach(territory => {
          users.forEach(user => {
            relations.push(Object.assign(new UserConfigurationProjection(), {
              user: user.username,
              userId: user.id,
              territory: territory.name,
              territoryId: territory.id,
              role: this.entityToEdit.name,
              roleId: this.entityToEdit.id,
              appliesToChildrenTerritories: false,
              createdDate: new Date().toISOString()
            }));
          });
        });
        return relations;
      })
      .withTargetsTitle('entity.role.users.title')
      .withTargetsLeftColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('entity.role.users.user.title', 'username'),
        this.utils.getNonEditableColumnDef('entity.role.users.user.firstName', 'firstName'),
        this.utils.getNonEditableColumnDef('entity.role.users.user.lastName', 'lastName'),
      ])
      .withTargetsLeftTitle('entity.role.users.user.title')
      .withTargetsLeftFetcher(() => this.userService.getAll())
      .withTargetsRightColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.code', 'code'),
        this.utils.getNonEditableColumnDef('common.form.type', 'typeName'),
      ])
      .withTargetsRightTitle('entity.role.users.territory.title')
      .withTargetsRightFetcher(() => this.territoryService.getAllProjection(TerritoryProjection))
      .build();
  }

  private defineTasksTable(): DataTableDefinition<TaskProjection, TaskProjection> {
    return DataTableDefinition.builder<TaskProjection, TaskProjection>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/taskQuery/:id/:typeId', {
          id: 'id',
          typeId: 'typeId'
        }),
        this.utils.getNonEditableColumnDef('entity.taskType.label', 'typeName'),
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        return this.entityToEdit.getRelationArrayEx(TaskProjection, 'tasks', {projection: 'view'})
      })
      .withRelationsUpdater(async (tasks: (TaskProjection & Status)[]) => {
        await onUpdatedRelation(tasks).forAll(items => {
          const newItems = items.map(item => this.tasksService.createProxy(item.id));
          return this.entityToEdit.substituteAllRelation('tasks', newItems)
        }
        );
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('entity.taskType.label', 'typeName', 100, 500),
        this.utils.getStatusColumnDef()
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.tasksService.getAllProjection(TaskProjection))
      .withTargetInclude((tasks: (TaskProjection)[]) => (item: TaskProjection) => {
        return !tasks.some((task) => task.id === item.id);
      })
      .withTargetsTitle(this.translateService.instant('entity.role.tasks.title'))
      .withTargetsOrder('name')
      .build();
  }


  private defineApplicationsTable(): DataTableDefinition<Application, Application> {
    return DataTableDefinition.builder<Application, Application>(this.dialog, this.errorHandler)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/application/:id/applicationForm', {id: 'id'}),
        this.utils.getNonEditableColumnDef('common.form.description', 'description', 100, 500),
        this.utils.getStatusColumnDef()
      ])
      .withRelationsOrder('name')
      .withRelationsFetcher(() => {
        if (this.isNew()) {
          return EMPTY;
        }
        return this.entityToEdit.getRelationArrayEx<Application>(Application, 'applications')
      })
      .withRelationsUpdater(async (applications: (Application & Status)[]) => {
        await onUpdatedRelation(applications).forAll(items =>
          this.entityToEdit.substituteAllRelation('applications', items)
        );
      })
      .withTargetsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getNonEditableColumnDef('common.form.name', 'name'),
        this.utils.getNonEditableColumnDef('common.form.description', 'description', 100, 500),
        this.utils.getStatusColumnDef()
      ])
      .withTargetsOrder('name')
      .withTargetsFetcher(() => this.applicationService.getAll())
      .withTargetInclude((applications: (Application)[]) => (item: Application) => {
        return !applications.some((application) => application.id === item.id);
      })
      .withTargetsTitle(this.translateService.instant('entity.role.applications.title'))
      .withTargetsOrder('name')
      .build();
    }
}




