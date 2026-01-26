import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {CodeListService, TaskGroup, TaskGroupService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-task-group',
    templateUrl: './task-group.component.html',
    styles: [],
    standalone: false
})
export class TaskGroupComponent extends BaseListComponent<TaskGroup> {
  entityListConfig: EntityListConfig<TaskGroup> = {
    entityLabel: Configuration.TASK_GROUP.labelPlural,
    iconName: Configuration.TASK_GROUP.icon,
    font: Configuration.TASK_GROUP.font,
    columnDefs: [],
    dataFetchFn: () => this.taskgroupService.getAll(),
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
    protected override loadingOverlay: LoadingOverlayService,
    public taskgroupService: TaskGroupService
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
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'taskGroup/:id/taskGroupForm', {id: 'id'}),
    ];
  }

  override async newData() {
    await this.router.navigate(['taskGroup', -1, 'taskGroupForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['taskGroup', -1, 'taskGroupForm', id]);
  }

  override dataFetchFn = () => this.taskgroupService.getAll();

  override dataUpdateFn = (data: TaskGroup) => firstValueFrom(this.taskgroupService.update(data))

  override dataDeleteFn = (data: TaskGroup) => firstValueFrom(this.taskgroupService.delete(data))
}
