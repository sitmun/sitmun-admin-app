import {Component} from '@angular/core';
import {CodeListService, Task, TaskService, TranslationService,} from '@app/domain';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {config} from '@config';
import {HalOptions, HalParam} from '@app/core/hal'
import {Configuration} from '@app/core/config/configuration';

@Component({
  selector: 'app-tasks-basic',
  templateUrl: './tasks-basic.component.html',
  styles: []
})
export class TasksBasicComponent extends BaseListComponent<Task> {
  entityListConfig: EntityListConfig<Task> = {
    entityLabel: Configuration.TASK_BASIC.labelPlural,
    iconName: Configuration.TASK_BASIC.icon,
    font: Configuration.TASK_BASIC.font,
    columnDefs: [],
    dataFetchFn: () => {
      const taskTypeID = config.tasksTypes.basic;
      const params2: HalParam[] = [];
      const param: HalParam = {key: 'type.id', value: taskTypeID};
      params2.push(param);
      const query: HalOptions = {params: params2};
      return this.taskService.getAll(query, undefined, 'tasks');
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
    protected override utils: UtilsService,
    protected override router: Router,
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
      router
    );
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', `taskBasic/:id/${config.tasksTypes.basic}`, {id: 'id'}),
    ];
  }

  override async newData() {
    await this.router.navigate(['taskBasic', -1, config.tasksTypes.basic]);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['taskBasic', -1, config.tasksTypes.basic, id]);
  }

  override dataFetchFn = () => this.taskService.getAll();

  override dataUpdateFn = (data: Task) => firstValueFrom(this.taskService.update(data))

  override dataDeleteFn = (data: Task) => firstValueFrom(this.taskService.delete(data))
}
