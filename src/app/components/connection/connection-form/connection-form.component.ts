import {Component} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseFormComponent} from "@app/components/base-form.component";
import {DataTableDefinition} from '@app/components/data-tables.util';
import {Configuration} from "@app/core/config/configuration";
import {MessagesInterceptorStateService} from '@app/core/interceptors/messages.interceptor';
import {
  CodeListService,
  Connection,
  ConnectionService,
  TaskProjection,
  TaskService,
  TranslationService
} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from "@app/services/loading-overlay.service";
import {LoggerService} from '@app/services/logger.service';
import {NotificationService} from '@app/services/notification.service';
import {UtilsService} from '@app/services/utils.service';


/**
 * Component for managing connection forms in the SITMUN application.
 * Extends BaseFormComponent to provide base functionality for connection management.
 *
 * @extends BaseFormComponent<Connection>
 */
@Component({
    selector: 'app-connection-form',
    templateUrl: './connection-form.component.html',
    styleUrls: ['./connection-form.component.scss'],
    standalone: false
})
export class ConnectionFormComponent extends BaseFormComponent<Connection> {

  private static readonly PASSWORD_PLACEHOLDER = '••••••••';

  readonly config = Configuration.CONNECTION;
  readonly tasksTable: DataTableDefinition<TaskProjection, TaskProjection>

  /** Flag indicating if the password is set */
  passwordSet = false;

  /** Flag indicating if the password is being edited */
  isPasswordBeingEdited = false;

  /** True after the user changes the password field during the current focus session. */
  private passwordDirtyInSession = false;

  /** Whether the connection had a password when the current password focus session started. */
  private hadPasswordBeforeFocusSession = false;

  constructor(
    dialog: MatDialog,
    translateService: TranslateService,
    translationService: TranslationService,
    codeListService: CodeListService,
    loggerService: LoggerService,
    errorHandler: ErrorHandlerService,
    activatedRoute: ActivatedRoute,
    router: Router,
    loadingService: LoadingOverlayService,
    messagesInterceptorState: MessagesInterceptorStateService,
    protected connectionService: ConnectionService,
    protected tasksService: TaskService,
    protected utils: UtilsService,
    protected notificationService: NotificationService,
  ) {
    super(dialog, translateService, translationService, codeListService, loggerService, errorHandler, activatedRoute, router, loadingService, messagesInterceptorState);
    this.tasksTable = this.defineTaskType();
  }

  override async preFetchData() {
    await this.initCodeLists(['databaseConnection.driver'])
  }

  override fetchOriginal(): Promise<Connection> {
    return firstValueFrom(this.connectionService.get(this.entityID));
  }

  override fetchCopy(): Promise<Connection> {
    return firstValueFrom(this.connectionService.get(this.duplicateID).pipe(map((copy: Connection) => {
      copy.name = this.translateService.instant("common.copyPrefix") + copy.name;
      return copy;
    })));
  }

  override empty(): Connection {
    const defaultDriver = this.defaultValueOrNull('databaseConnection.driver');
    return Object.assign(new Connection(), {
      driver: defaultDriver?.value || null,
    })
  }

  override postFetchData() {
    if (!this.entityToEdit) {
      throw new Error('Cannot initialize form: entity is undefined');
    }
    this.resetPasswordFieldState();
    this.entityForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.entityToEdit.name, [Validators.required]),
      driver: new UntypedFormControl(this.entityToEdit.driver, [Validators.required]),
      user: new UntypedFormControl(this.entityToEdit.user),
      newPassword: new UntypedFormControl(
        this.passwordSet ? ConnectionFormComponent.PASSWORD_PLACEHOLDER : '',
        []
      ),
      url: new UntypedFormControl(this.entityToEdit.url, [Validators.required]),
    });
  }

  override afterSave(): void {
    super.afterSave();
    this.resetPasswordFieldState();
    const control = this.entityForm?.get('newPassword');
    if (control) {
      control.setValue(this.passwordSet ? ConnectionFormComponent.PASSWORD_PLACEHOLDER : '');
      control.markAsPristine();
      control.markAsUntouched();
    }
  }

  createObject(id: number = null): Connection {
    let safeToEdit = Connection.fromObject(this.entityToEdit);
    const formValues = this.entityForm.getRawValue();
    safeToEdit = Object.assign(safeToEdit,
      formValues,
      {
        id: id,
      }
    );
    if (this.isPasswordBeingEdited) {
      safeToEdit.password = formValues.newPassword;
    }
    return Connection.fromObject(safeToEdit);
  }

  onPasswordFocus(): void {
    this.passwordDirtyInSession = false;
    this.hadPasswordBeforeFocusSession = this.passwordSet;
    this.clearPasswordPlaceholder();
  }

  onPasswordBlur(): void {
    if (this.shouldRestorePasswordPlaceholder()) {
      this.restorePasswordPlaceholder();
    }
  }

  onPasswordChange(): void {
    this.clearPasswordPlaceholder();
    const passwordValue = this.entityForm.get('newPassword')?.value ?? '';

    if (passwordValue !== '') {
      this.passwordDirtyInSession = true;
      this.isPasswordBeingEdited = true;
      this.passwordSet = true;
    } else if (this.hadPasswordBeforeFocusSession) {
      this.revertPasswordEditSession();
    } else {
      this.passwordDirtyInSession = true;
      this.passwordSet = false;
      this.isPasswordBeingEdited = true;
    }
  }

  override async createEntity(): Promise<number> {
    const entityToCreate = this.createObject();
    const response = await firstValueFrom(this.connectionService.create(entityToCreate));
    return response.id;
  }

  override async updateEntity() {
    const entityToUpdate = this.createObject(this.entityID);
    await firstValueFrom(this.connectionService.update(entityToUpdate));
  }

  override canSave(): boolean {
    return this.entityForm?.valid ?? false;
  }

  canValidateConnection(): boolean {
    if (!this.entityForm || !this.hasRequiredConnectionFields()) {
      return false;
    }
    if (this.canTestStoredConnection()) {
      return true;
    }
    return this.canTestWithFormCredentials();
  }

  validateConnection(): void {
    if (!this.canValidateConnection()) {
      return;
    }

    const request$ = this.canTestStoredConnection()
      ? this.connectionService.testStoredConnection(this.entityID)
      : this.connectionService.testConnection(this.buildTestPayloadFromForm());

    request$.subscribe({
      next: () => this.notificationService.showSuccess("entity.connection.test.title", "entity.connection.test.success"),
      error: err => {
        const errorMessage = err.error?.message;
        const shouldTranslate = !errorMessage;
        const message = errorMessage || "entity.connection.test.error.unknown";
        this.notificationService.showError("entity.connection.test.title", message, shouldTranslate);
      }
    });
  }

  private defineTaskType(): DataTableDefinition<TaskProjection, TaskProjection> {
    return DataTableDefinition.builder<TaskProjection, TaskProjection>(this.dialog, this.errorHandler, this.loadingService)
      .withRelationsColumns([
        this.utils.getSelCheckboxColumnDef(),
        this.utils.getRouterLinkColumnDef('common.form.name', 'name', '/tasks/:id/:typeId', {
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

  private hasRequiredConnectionFields(): boolean {
    const driver = this.entityForm.get('driver')?.value;
    const url = this.entityForm.get('url')?.value;
    return this.isNonEmptyField(driver) && this.isNonEmptyField(url);
  }

  private canTestStoredConnection(): boolean {
    return this.isEdition()
      && !this.isPasswordBeingEdited
      && !this.connectionFieldsDifferFromEntity();
  }

  private canTestWithFormCredentials(): boolean {
    const passwordValue = this.entityForm.get('newPassword')?.value ?? '';
    if (this.isPlaceholderPasswordValue(passwordValue)) {
      return false;
    }
    return this.isPasswordBeingEdited || !this.passwordSet || this.isNewOrDuplicated();
  }

  private connectionFieldsDifferFromEntity(): boolean {
    if (!this.entityToEdit) {
      return false;
    }
    const formValues = this.entityForm.getRawValue();
    return formValues.driver !== this.entityToEdit.driver
      || formValues.url !== this.entityToEdit.url
      || (formValues.user ?? '') !== (this.entityToEdit.user ?? '');
  }

  private buildTestPayloadFromForm() {
    const formValues = this.entityForm.getRawValue();
    const payload: { driver: string; url: string; user?: string; password?: string } = {
      driver: formValues.driver,
      url: formValues.url,
      user: formValues.user,
    };
    if (this.isPasswordBeingEdited) {
      payload.password = formValues.newPassword;
    }
    return payload;
  }

  private isNonEmptyField(value: unknown): boolean {
    if (value == null) {
      return false;
    }
    return String(value).trim() !== '';
  }

  private isPlaceholderPasswordValue(value: unknown): boolean {
    return value === ConnectionFormComponent.PASSWORD_PLACEHOLDER;
  }

  private resetPasswordFieldState(): void {
    if (this.isNew() || this.isDuplicated()) {
      this.passwordSet = false;
    } else {
      this.passwordSet = this.entityToEdit?.passwordSet ?? false;
    }
    this.isPasswordBeingEdited = false;
    this.passwordDirtyInSession = false;
    this.hadPasswordBeforeFocusSession = false;
  }

  private shouldRestorePasswordPlaceholder(): boolean {
    if (!this.hadPasswordBeforeFocusSession) {
      return false;
    }
    const value = this.entityForm?.get('newPassword')?.value ?? '';
    const isEmpty = value === '' || value === ConnectionFormComponent.PASSWORD_PLACEHOLDER;
    return isEmpty || !this.passwordDirtyInSession;
  }

  private revertPasswordEditSession(): void {
    this.passwordDirtyInSession = false;
    this.isPasswordBeingEdited = false;
    this.passwordSet = true;
  }

  private restorePasswordPlaceholder(): void {
    const control = this.entityForm?.get('newPassword');
    control?.setValue(ConnectionFormComponent.PASSWORD_PLACEHOLDER);
    control?.markAsPristine();
    control?.markAsUntouched();
    this.isPasswordBeingEdited = false;
    this.passwordSet = true;
  }

  private clearPasswordPlaceholder(): void {
    const control = this.entityForm?.get('newPassword');
    const value = control?.value ?? '';
    if (value === ConnectionFormComponent.PASSWORD_PLACEHOLDER) {
      control.setValue('');
    } else if (value.includes(ConnectionFormComponent.PASSWORD_PLACEHOLDER)) {
      control.setValue(value.replaceAll(ConnectionFormComponent.PASSWORD_PLACEHOLDER, ''));
    }
  }

}
