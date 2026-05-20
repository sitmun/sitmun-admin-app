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
import {CodeListService, ConfigurationParameter, ConfigurationParametersService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-configuration-parameter',
    templateUrl: './configuration-parameter.component.html',
    styles: [],
    standalone: false
})
export class ConfigurationParameterComponent extends BaseListComponent<ConfigurationParameter> {
  entityListConfig: EntityListConfig<ConfigurationParameter> = {
    entityLabel: Configuration.CONFIGURATION_PARAMETER.labelPlural,
    iconName: Configuration.CONFIGURATION_PARAMETER.icon,
    font: Configuration.CONFIGURATION_PARAMETER.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.configurationParametersService),
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
    public configurationParametersService: ConfigurationParametersService
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
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'configurationParameter/:id/configurationParameterForm', {id: 'id'}, 130, 250);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    const valueCol: any = this.utils.getNonEditableColumnDef('common.form.value', 'value', 130, 250);
    valueCol.sortable = true;
    valueCol.cellRendererParams = {...valueCol.cellRendererParams, sortField: 'value'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      valueCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['configurationParameter', -1, 'configurationParameterForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['configurationParameter', -1, 'configurationParameterForm', id]);
  }

  override dataUpdateFn = (data: ConfigurationParameter) => firstValueFrom(this.configurationParametersService.update(data))

  override dataDeleteFn = (data: ConfigurationParameter) => firstValueFrom(this.configurationParametersService.delete(data))
}
