import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {createPagedInfiniteFetcher} from "@app/core/hal";
import {INFINITE_PAGE_SIZE_DEFAULT} from "@app/core/hal/infinite-page-size";
import {Background, BackgroundService, CodeListService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-background-layers',
    templateUrl: './background-layers.component.html',
    styles: [],
    standalone: false
})
export class BackgroundLayersComponent extends BaseListComponent<Background> {
  entityListConfig: EntityListConfig<Background> = {
    entityLabel: Configuration.BACKGROUND_LAYER.labelPlural,
    iconName: Configuration.BACKGROUND_LAYER.icon,
    font: Configuration.BACKGROUND_LAYER.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    defaultColumnSorting: ['name'],
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.backgroundService),
    progressiveLocalFilter: false,
    backendSearch: true,
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
    public backgroundService: BackgroundService
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
    // Set column definitions directly in the config
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'backgroundLayers/:id/backgroundLayersForm', {id: 'id'});
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['backgroundLayers', -1, 'backgroundLayersForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['backgroundLayers', -1, 'backgroundLayersForm', id]);
  }

  override dataFetchFn = () => this.backgroundService.fetchAllItems();

  override dataUpdateFn = (data: Background) => firstValueFrom(this.backgroundService.update(data))

  override dataDeleteFn = (data: Background) => firstValueFrom(this.backgroundService.delete(data))
}
