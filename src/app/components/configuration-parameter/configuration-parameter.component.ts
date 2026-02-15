import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
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
    dataFetchFn: () => this.configurationParametersService.getAll(),
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
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'configurationParameter/:id/configurationParameterForm', {id: 'id'}),
      this.utils.getNonEditableColumnDef('common.form.value', 'value'),
    ];
  }

  override async newData() {
    await this.router.navigate(['configurationParameter', -1, 'configurationParameterForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['configurationParameter', -1, 'configurationParameterForm', id]);
  }

  override dataFetchFn = () => this.configurationParametersService.getAll();

  override dataUpdateFn = (data: ConfigurationParameter) => firstValueFrom(this.configurationParametersService.update(data))

  override dataDeleteFn = (data: ConfigurationParameter) => firstValueFrom(this.configurationParametersService.delete(data))
}
