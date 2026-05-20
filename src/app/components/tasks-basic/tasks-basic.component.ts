import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom,of} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {createPagedInfiniteFetcher} from '@app/core/hal'
import {INFINITE_PAGE_SIZE_DEFAULT} from '@app/core/hal/infinite-page-size';
import {CodeListService, Task, TaskService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {config} from '@config';

@Component({
    selector: 'app-tasks-basic',
    templateUrl: './tasks-basic.component.html',
    styles: [],
    standalone: false
})
export class TasksBasicComponent extends BaseListComponent<Task> {
  entityListConfig: EntityListConfig<Task> = {
    entityLabel: Configuration.TASK_BASIC.labelPlural,
    iconName: Configuration.TASK_BASIC.icon,
    font: Configuration.TASK_BASIC.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.taskService, {
      params: [{key: 'typeId', value: config.tasksTypes.basic}]
    }),
    progressiveLocalFilter: false,
    backendSearch: true,
    defaultColumnSorting: ['name'],
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
    public taskService: TaskService
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
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', `taskBasic/:id/${config.tasksTypes.basic}`, {id: 'id'}, 130, 250);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['taskBasic', -1, config.tasksTypes.basic]);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['taskBasic', -1, config.tasksTypes.basic, id]);
  }

  override dataUpdateFn = (data: Task) => firstValueFrom(this.taskService.update(data))

  override dataDeleteFn = (data: Task) => firstValueFrom(this.taskService.delete(data))
}
