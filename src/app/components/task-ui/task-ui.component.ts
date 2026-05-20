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
import {CodeListService, TaskUI, TaskUIService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-task-ui',
    templateUrl: './task-ui.component.html',
    styles: [],
    standalone: false
})
export class TaskUIComponent extends BaseListComponent<TaskUI> {
  entityListConfig: EntityListConfig<TaskUI> = {
    entityLabel: Configuration.TASK_UI.labelPlural,
    iconName: Configuration.TASK_UI.icon,
    font: Configuration.TASK_UI.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.taskUIService),
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
    public taskUIService: TaskUIService
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
    const nameCol: any = this.utils.getRouterLinkColumnDef('entity.taskUI.identifier', 'name', 'task-ui/:id/taskUIForm', {id: 'id'}, 180);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 2;
    nameCol.tooltipField = 'name';

    const tooltipCol: any = this.utils.getNonEditableColumnDef('entity.taskUI.name', 'tooltip', 260);
    tooltipCol.sortable = true;
    tooltipCol.cellRendererParams = {...tooltipCol.cellRendererParams, sortField: 'tooltip'};
    tooltipCol.flex = 3;
    tooltipCol.tooltipField = 'tooltip';

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      tooltipCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['task-ui', -1, 'taskUIForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['task-ui', -1, 'taskUIForm', id]);
  }

  override dataUpdateFn = (data: TaskUI) => firstValueFrom(this.taskUIService.update(data))

  override dataDeleteFn = (data: TaskUI) => firstValueFrom(this.taskUIService.delete(data))
}
