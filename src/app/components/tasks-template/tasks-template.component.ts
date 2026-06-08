import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, of } from 'rxjs';

import { BaseListComponent } from '@app/components/base-list.component';
import { EntityListConfig } from '@app/components/shared/entity-list';
import { Configuration } from '@app/core/config/configuration';
import { createPagedInfiniteFetcher } from '@app/core/hal';
import { INFINITE_PAGE_SIZE_DEFAULT } from '@app/core/hal/infinite-page-size';
import { CodeListService, Task, TaskService, TranslationService } from '@app/domain';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';
import { config } from '@config';

@Component({
  selector: 'app-tasks-template',
  templateUrl: './tasks-template.component.html',
  styles: [],
  standalone: false,
})
export class TasksTemplateComponent extends BaseListComponent<Task> {
  entityListConfig: EntityListConfig<Task> = {
    entityLabel: Configuration.TASK_TEMPLATE.labelPlural,
    iconName: Configuration.TASK_TEMPLATE.icon,
    font: Configuration.TASK_TEMPLATE.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.taskService, {
      params: [{key: 'typeId', value: config.tasksTypes.template}]
    }),
    progressiveLocalFilter: false,
    backendSearch: true,
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
      hideReplaceButton: true,
    },
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
    public taskService: TaskService,
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
      loadingOverlay,
    );
  }

  override async postFetchData(): Promise<void> {
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', `taskTemplate/:id/${config.tasksTypes.template}`, { id: 'id' }),
    ];
  }

  override async newData() {
    await this.router.navigate(['taskTemplate', -1, config.tasksTypes.template]);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['taskTemplate', -1, config.tasksTypes.template, id]);
  }

  override dataUpdateFn = (data: Task) => firstValueFrom(this.taskService.update(data));

  override dataDeleteFn = (data: Task) => firstValueFrom(this.taskService.delete(data));
}
