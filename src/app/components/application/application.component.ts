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
import {Application, ApplicationService, CodeListService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styles: [],
    standalone: false
})
export class ApplicationComponent extends BaseListComponent<Application> {
  entityListConfig: EntityListConfig<Application> = {
    entityLabel: Configuration.APPLICATION.labelPlural,
    iconName: Configuration.APPLICATION.icon,
    font: Configuration.APPLICATION.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.applicationService),
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
      router,
      loadingOverlay
    );
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['application.type']);
  }

  override async postFetchData(): Promise<void> {
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'application/:id/applicationForm', {id: 'id'}, 200);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 3;
    nameCol.tooltipField = 'name';

    const typeCol: any = this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', this.codeList('application.type'));
    typeCol.sortable = true;
    typeCol.cellRendererParams = {...typeCol.cellRendererParams, sortField: 'type'};
    typeCol.minWidth = 140;
    typeCol.flex = 1;

    const themeCol: any = this.utils.getEditableColumnDef('entity.application.type.generic.css', 'theme', 180);
    themeCol.sortable = true;
    themeCol.cellRendererParams = {...themeCol.cellRendererParams, sortField: 'theme'};
    themeCol.flex = 2;
    themeCol.tooltipField = 'theme';

    const dateCol: any = this.utils.getDateColumnDef('common.form.createdDate', 'createdDate');
    dateCol.sortable = true;
    dateCol.cellRendererParams = {...dateCol.cellRendererParams, sortField: 'createdDate'};
    dateCol.width = 140;
    dateCol.maxWidth = 140;
    dateCol.flex = 0;

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      typeCol,
      themeCol,
      dateCol
    ];
  }

  override async newData() {
    await this.router.navigate(['application', -1, 'applicationForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['application', -1, 'applicationForm', id]);
  }

  override dataUpdateFn = (data: Application) => firstValueFrom(this.applicationService.update(data))

  override dataDeleteFn = (data: Application) => firstValueFrom(this.applicationService.delete(data))
}
