import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ConnectionService,
  CartographyService,
  TaskService,
  Connection,
  TaskProjection,
  TranslationService,
  CodeListService
} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {firstValueFrom, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {BaseFormComponent} from "@app/components/base-form.component";
import {LoggerService} from '@app/services/logger.service';
import {DataTableDefinition} from '@app/components/data-tables.util';
import {TranslateService} from '@ngx-translate/core';
import {ErrorHandlerService} from '@app/services/error-handler.service';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styles: []
})
export class ConnectionFormComponent extends BaseFormComponent<Connection> {

  readonly tasksTable: DataTableDefinition<TaskProjection, TaskProjection>

  /** Flag indicating if the password is set */
  passwordSet = false;

  /** Flag indicating if the password is being edited */
  isPasswordBeingEdited = false;

  /**
   * Creates an instance of ConnectionFormComponent.
   *
   * @param dialog - Material dialog service for modal interactions
   * @param translateService
   * @param translationService
   * @param codeListService
   * @param errorHandler
   * @param activatedRoute - Angular route service
   * @param router - Angular router for navigation
   * @param connectionService - Service for connection CRUD operations
   * @param cartographyService - Service for cartography operations
   * @param tasksService - Service for task operations
   * @param utils - Utility service for common operations
   * @param loggerService - Service for logging
   */
  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    protected connectionService: ConnectionService,
    protected cartographyService: CartographyService,
    protected tasksService: TaskService,
    protected utils: UtilsService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router);
    this.tasksTable = this.defineTaskType();
  }

  /**
   * Initializes component data before fetching.
   * Sets up data tables, translations, and situation map list.
   */
  override async preFetchData() {
    this.dataTables.register(this.tasksTable);

    await this.initCodeLists(['databaseConnection.driver'])
  }

  /**
   * Fetches the original entity by ID.
   * @returns Promise of Connection entity with projection
   */
  override fetchOriginal(): Promise<Connection> {
    return firstValueFrom(this.connectionService.get(this.entityID));
  }

  /**
   * Creates a copy of an existing entity for duplication.
   * @returns Promise of duplicated Connection entity
   */
  override fetchCopy(): Promise<Connection> {
    return firstValueFrom(this.connectionService.get(this.duplicateID).pipe(map((copy: Connection) => {
      copy.name = this.translateService.instant("copy_") + copy.name;
      return copy;
    })));
  }

  /**
   * Creates an empty entity with default values.
   * @returns New Connection instance
   */
  override empty(): Connection {
    return Object.assign(new Connection(), {
      driver: this.firstInCodeList('databaseConnection.driver').value,
    })
  }


  /**
   * Initializes form data after an entity is fetched.
   * Sets up reactive form with entity values and validation rules.
   * @throws Error if entity is undefined
   */
  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }
    if (this.isDuplicated()) {
      this.passwordSet = false;
    } else {
      this.passwordSet = this.entityToEdit.passwordSet || false;
    }
    this.isPasswordBeingEdited = false;

    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      driver: new UntypedFormControl(this.entityToEdit.driver, [Validators.required]),
      user: new UntypedFormControl(this.entityToEdit.user),
      newPassword: new UntypedFormControl(''),
      url: new UntypedFormControl(this.entityToEdit.url),
    });
  }

  /**
   * Creates a Connection object from the current form values.
   * Handles the password field specially based on passwordSet flag.
   *
   * @param id - Optional ID for the new object, used when updating
   * @returns New Connection instance populated with form values
   */
  createObject(id: number = null): Connection {
    let safeToEdit = Connection.fromObject(this.entityToEdit);
    safeToEdit = Object.assign(safeToEdit,
      this.entityForm.value,
      {
        id: id,
      }
    );
    if (this.isPasswordBeingEdited) {
      safeToEdit.password = this.entityForm.get('newPassword').value;
    }
    return Connection.fromObject(safeToEdit);
  }

  /**
   * Handles password input changes.
   * Updates passwordSet flag and manages placeholder behavior.
   */
  onPasswordChange() {
    const password = this.entityForm.get('newPassword').value;

    // If this is the first change
    if (!this.isPasswordBeingEdited && password !== '') {
      this.isPasswordBeingEdited = true;
      return;
    }
  }

  /**
   * Creates a new entity or duplicates an existing one.
   * @returns Promise of created entity ID
   */
  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.connectionService.create(entityToCreate));
    return response.id;
  }

  /**
   * Updates an existing entity with form values.
   */
  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.connectionService.update(entityToUpdate));
  }

  /**
   * Checks form validity and application-specific rules.
   * @returns boolean indicating if save is allowed
   */
  override canSave(): boolean {
    return true;
  }

  /**
   * Defines the data table configuration for managing task members.
   * Sets up columns, data fetching, updating logic, and target selection.
   *
   * @returns Configured data table definition for task members
   */
  private defineTaskType(): DataTableDefinition<TaskProjection, TaskProjection> {
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
          return of([]);
        }
        return this.entityToEdit.getRelationArrayEx(TaskProjection, 'tasks', {projection: 'view'})
      })
      .build();
  }

  /**
   * Tests the database connection with current form values.
   */
  validateConnection() {
    const connection = {
      driver: this.entityForm.value.driver,
      url: this.entityForm.value.url,
      user: this.entityForm.value.user,
      password: this.entityForm.value.password
    };
    this.connectionService.testConnection(connection).subscribe({
      error: err => this.loggerService.error('Error testing connection', err)
    });
  }

}
