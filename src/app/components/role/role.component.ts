import {Component} from '@angular/core';
import {CodeListService, Role, RoleService, TranslationService,} from '@app/domain';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styles: [],
})
export class RoleComponent extends BaseListComponent<Role> {
  entityListConfig: EntityListConfig<Role> = {
    entityLabel: 'entity.role.label',
    iconName: 'menu_rol',
    columnDefs: [],
    dataFetchFn: () => this.roleService.getAll(),
    defaultColumnSorting: ['name'],
    gridOptions: {
      globalSearch: true,
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
    public roleService: RoleService
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
      router
    );
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'role/:id/roleForm', {id: 'id'}),
    ];
  }

  override async newData() {
    await this.router.navigate(['role', -1, 'roleForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['role', -1, 'roleForm', id]);
  }

  override dataFetchFn = () => this.roleService.getAll();

  override dataUpdateFn = (data: Role) => firstValueFrom(this.roleService.update(data))

  override dataDeleteFn = (data: Role) => firstValueFrom(this.roleService.delete(data))
}
