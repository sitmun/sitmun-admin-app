import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {BaseListComponent} from '@app/components/base-list.component';
import {EntityListConfig} from '@app/components/shared/entity-list';
import {Configuration} from '@app/core/config/configuration';
import {createPagedInfiniteFetcher} from '@app/core/hal';
import {INFINITE_PAGE_SIZE_DEFAULT} from '@app/core/hal/infinite-page-size';
import {CodeListService, TaskType, TaskTypeService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

import {formatTaskTypeIdentifier} from './task-type.util';

@Component({
    selector: 'app-task-type',
    templateUrl: './task-type.component.html',
    styles: [],
    standalone: false
})
export class TaskTypeComponent extends BaseListComponent<TaskType> {
  entityListConfig: EntityListConfig<TaskType> = {
    entityLabel: Configuration.TASK_TYPE.labelPlural,
    iconName: Configuration.TASK_TYPE.icon,
    font: Configuration.TASK_TYPE.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.taskTypeService, {
      params: () => [{key: 'lang', value: this.requestLang()}],
    }),
    progressiveLocalFilter: false,
    backendSearch: true,
    defaultColumnSorting: ['order'],
    gridOptions: {
      discardChangesButton: false,
      redoButton: false,
      undoButton: false,
      applyChangesButton: false,
      deleteButton: false,
      newButton: false,
      actionButton: true,
      hideReplaceButton: true,
      hideDuplicateButton: true,
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
    public taskTypeService: TaskTypeService
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
    const idCol: any = {
      ...this.utils.getRouterLinkColumnDef(
        'entity.taskType.identifier',
        'id',
        'taskType/:id/taskTypeForm',
        {id: 'id'},
        220
      ),
      valueGetter: (params) => {
        if (!params.data) {
          return '';
        }
        return formatTaskTypeIdentifier(params.data.id, params.data.name);
      },
    };
    idCol.sortable = true;
    idCol.cellRendererParams = {...idCol.cellRendererParams, sortField: 'id'};
    idCol.flex = 1;
    idCol.tooltipValueGetter = (params) => params.value;

    const titleCol: any = {
      ...this.utils.getRouterLinkColumnDef(
        'entity.taskType.title',
        'title',
        'taskType/:id/taskTypeForm',
        {id: 'id'},
        220
      ),
      valueGetter: (params) => params.data?.title || '',
    };
    titleCol.sortable = true;
    titleCol.cellRendererParams = {...titleCol.cellRendererParams, sortField: 'title'};
    titleCol.flex = 1;
    titleCol.tooltipValueGetter = (params) => params.value;

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      idCol,
      titleCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['taskType', -1, 'taskTypeForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['taskType', -1, 'taskTypeForm', id]);
  }

  override dataUpdateFn = (data: TaskType) => firstValueFrom(this.taskTypeService.update(data));

  override dataDeleteFn = (data: TaskType) => firstValueFrom(this.taskTypeService.delete(data));
}
