import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {HalOptions, HalParam} from '@app/core/hal'
import {INFINITE_PAGE_SIZE_DEFAULT} from '@app/core/hal/infinite-page-size';
import {CodeListService, Task, TaskService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {config} from '@config';

@Component({
    selector: 'app-tasks-query',
    templateUrl: './tasks-query.component.html',
    styles: [],
    standalone: false
})
export class TasksQueryComponent extends BaseListComponent<Task> {
  entityListConfig: EntityListConfig<Task> = {
    entityLabel: Configuration.TASK_QUERY.labelPlural,
    iconName: Configuration.TASK_QUERY.icon,
    font: Configuration.TASK_QUERY.font,
    columnDefs: [],
    dataFetchFn: () => this.taskService.fetchAllItems(this.taskQueryHalOptions(), undefined, 'tasks'),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteGridHeight: '80vh', // Increased height for better visibility
    infiniteBlockFetcher: (request) => {
      const halOptions = this.taskQueryHalOptions();
      return this.taskService.fetchPage({
        page: request.page,
        size: request.size,
        sort: request.sort,
        params: halOptions.params,
      }, undefined, 'tasks');
    },
    defaultColumnSorting: ['name'],
    gridOptions: {
      globalSearch: false,
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

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['queryTask.scope']);
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', `taskQuery/:id/${config.tasksTypes.query}`, {id: 'id'});
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'properties.scope', this.codeList('queryTask.scope')),
    ];
  }

  private taskQueryHalOptions(): HalOptions {
    const params: HalParam[] = [{key: 'type.id', value: config.tasksTypes.query}];
    return {params};
  }

  override async newData() {
    await this.router.navigate(['taskQuery', -1, config.tasksTypes.query]);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['taskQuery', -1, config.tasksTypes.query, id]);
  }

  override dataFetchFn = () => this.taskService.fetchAllItems(this.taskQueryHalOptions(), undefined, 'tasks');

  override dataUpdateFn = (data: Task) => firstValueFrom(this.taskService.update(data))

  override dataDeleteFn = (data: Task) => firstValueFrom(this.taskService.delete(data))
}
