import {Component} from '@angular/core';
import {Application, ApplicationService, CodeListService, TranslationService,} from '@app/domain';
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
  selector: 'app-application',
  templateUrl: './application.component.html',
  styles: [],
})
export class ApplicationComponent extends BaseListComponent<Application> {
  entityListConfig: EntityListConfig<Application> = {
    entityLabel: 'entity.application.label',
    iconName: 'ic_gruptasca',
    columnDefs: [],
    dataFetchFn: () => this.applicationService.getAll(),
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
    public applicationService: ApplicationService
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

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['application.type']);
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'application/:id/applicationForm', {id: 'id'}),
      this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', this.codeList('application.type')),
      this.utils.getEditableColumnDef('entity.application.type.generic.css', 'theme'),
      this.utils.getDateColumnDef('common.form.createdDate', 'createdDate')
    ];
  }

  override async newData() {
    await this.router.navigate(['application', -1, 'applicationForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['application', -1, 'applicationForm', id]);
  }

  override dataFetchFn = () => this.applicationService.getAll();

  override dataUpdateFn = (data: Application) => firstValueFrom(this.applicationService.update(data))

  override dataDeleteFn = (data: Application) => firstValueFrom(this.applicationService.delete(data))
}
