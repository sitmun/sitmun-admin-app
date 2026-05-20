import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom,of} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {createPagedInfiniteFetcher} from '@app/core/hal';
import {INFINITE_PAGE_SIZE_DEFAULT} from '@app/core/hal/infinite-page-size';
import {CodeListService, TranslationService, User, UserService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styles: [],
    standalone: false
})
export class UserComponent extends BaseListComponent<User> {
  entityListConfig: EntityListConfig<User> = {
    entityLabel: Configuration.USER.labelPlural,
    iconName: Configuration.USER.icon,
    font: Configuration.USER.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.userService),
    progressiveLocalFilter: false,
    backendSearch: true,
    defaultColumnSorting: ['username'],
    gridOptions: {
      discardChangesButton: false,
      redoButton: false,
      undoButton: false,
      applyChangesButton: false,
      deleteButton: true,
      newButton: true,
      actionButton: true,
      hideReplaceButton: true
    }
  };

  constructor(
    protected override dialog: MatDialog,
    protected override translateService: TranslateService,
    protected override translationService: TranslationService,
    protected override codeListService: CodeListService,
    protected override loggerService: LoggerService,
    protected override errorHandler: ErrorHandlerService,
    protected override activatedRoute: ActivatedRoute,
    protected override utils: UtilsService,
    protected override router: Router,
    protected override loadingOverlay: LoadingOverlayService,
    public userService: UserService
  ) {
    super(
      dialog,
      translateService,
      translationService,
      codeListService,
      loggerService,
      errorHandler,
      activatedRoute,
      utils,
      router,
      loadingOverlay
    );
  }

  override async postFetchData(): Promise<void> {
    const usernameCol: any = this.utils.getRouterLinkColumnDef('common.form.identifier', 'username', 'user/:id/userForm', {id: 'id'}, 130, 250);
    usernameCol.sortable = true;
    usernameCol.cellRendererParams = {...usernameCol.cellRendererParams, sortField: 'username'};

    const firstNameCol: any = this.utils.getNonEditableColumnDef('entity.user.firstname', 'firstName', 130, 250);
    firstNameCol.sortable = true;
    firstNameCol.cellRendererParams = {...firstNameCol.cellRendererParams, sortField: 'firstName'};

    const lastNameCol: any = this.utils.getNonEditableColumnDef('entity.user.lastname', 'lastName', 130, 250);
    lastNameCol.sortable = true;
    lastNameCol.cellRendererParams = {...lastNameCol.cellRendererParams, sortField: 'lastName'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      usernameCol,
      firstNameCol,
      lastNameCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['user', -1, 'userForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['user', -1, 'userForm', id]);
  }

  override dataUpdateFn = (data: User) => firstValueFrom(this.userService.update(data))

  override dataDeleteFn = (data: User) => {
    // Prevent deletion of built-in users (admin and public)
    if (data.username === 'admin' || data.username === 'public') {
      return Promise.reject(new Error(`Cannot delete built-in ${data.username} user`));
    }
    return firstValueFrom(this.userService.delete(data));
  }
}
