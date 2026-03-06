import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, map} from 'rxjs';

import {BaseListComponent} from '@app/components/base-list.component';
import {EntityListConfig} from '@app/components/shared/entity-list';
import {Configuration} from '@app/core/config/configuration';
import {HalOptions, HalParam} from '@app/core/hal';
import {CodeListService, Task, TaskService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {magic} from '@environments/constants';

@Component({
  selector: 'app-tasks-more-info-advanced',
  templateUrl: './tasks-more-info-advanced.component.html',
  styles: [],
  standalone: false
})
export class TasksMoreInfoAdvancedComponent extends BaseListComponent<Task> {
  entityListConfig: EntityListConfig<Task> = {
    entityLabel: Configuration.TASK_MORE_INFO_ADVANCED.labelPlural,
    iconName: Configuration.TASK_MORE_INFO_ADVANCED.icon,
    font: Configuration.TASK_MORE_INFO_ADVANCED.font,
    columnDefs: [],
    dataFetchFn: () => {
      const params: HalParam[] = [];
      params.push({key: 'type.id', value: magic.taskMoreInfoTypeId});
      const query: HalOptions = {params};
      return this.taskService.getAll(query, undefined, 'tasks').pipe(
        map(tasks => (tasks || []).filter(task => {
          const properties = (task?.properties && typeof task.properties === 'object' && !Array.isArray(task.properties))
            ? task.properties as Record<string, unknown>
            : {};
          return properties['moreInfoAdvanced'] === true;
        }))
      );
    },
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
    protected override router: Router,
    protected override loadingOverlay: LoadingOverlayService,
    public taskService: TaskService,
    protected override readonly utils: UtilsService
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
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef(
        'common.form.name',
        'name',
        `tasksMoreInfoAdvanced/:id/${magic.taskMoreInfoTypeId}`,
        {id: 'id'}
      ),
      this.utils.getNonEditableColumnWithProviderDef(
        'tasksMoreInfoAdvancedEntity.taskKind',
        'properties.advancedTaskKind',
        (value: string) => `tasksMoreInfoAdvancedEntity.kind.${value}`
      ),
      this.utils.getNonEditableColumnDef('tasksMoreInfoAdvancedEntity.cartography', 'cartographyName')
    ];
  }

  override async newData(): Promise<void> {
    await this.router.navigate(['tasksMoreInfoAdvanced', -1, magic.taskMoreInfoTypeId]);
  }

  override async duplicateItem(id: number): Promise<void> {
    await this.router.navigate(['tasksMoreInfoAdvanced', -1, magic.taskMoreInfoTypeId, id]);
  }

  override dataUpdateFn = (data: Task) => firstValueFrom(this.taskService.update(data));

  override dataDeleteFn = (data: Task) => firstValueFrom(this.taskService.delete(data));
}
