import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {INFINITE_PAGE_SIZE_DEFAULT} from '@app/core/hal/infinite-page-size';
import {
  Cartography,
  CartographyProjection,
  CartographyService,
  CodeListService,
  TranslationService,
} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-layers',
    templateUrl: './layers.component.html',
    styles: [],
    standalone: false
})
export class LayersComponent extends BaseListComponent<CartographyProjection> {
  entityListConfig: EntityListConfig<CartographyProjection> = {
    entityLabel: Configuration.LAYER.labelPlural,
    iconName: Configuration.LAYER.icon,
    font: Configuration.LAYER.font,
    columnDefs: [],
    dataFetchFn: () => of([]), // Not used in infinite mode - data loaded via infiniteBlockFetcher
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: (request) => {
      const options = {
        page: request.page,
        size: request.size,
        sort: request.sort,
      };
      const page$ = request.searchText
        ? this.cartographyService.searchTextPage(request.searchText, options)
        : this.cartographyService.fetchPage(options);
      return page$.pipe(
        map(page => {
          return {
            ...page,
            rows: page.rows.map(c => CartographyProjection.fromObject(c))
          };
        })
      );
    },
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
    public cartographyService: CartographyService
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
    await this.initCodeLists(['databaseConnection.driver']);
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'layers/:id/layersForm', {id: 'id'}, 220);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 3;
    nameCol.minWidth = 220;
    nameCol.tooltipField = 'name';

    const layerCol: any = {
      ...this.utils.getNonEditableColumnDef('entity.cartography.layerSet.short', 'layers', 140),
      ...this.utils.getArrayValueParser(),
      flex: 2,
      minWidth: 140,
      cellClass: 'read-only-cell sitmun-technical-cell',
      tooltipValueGetter: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value,
      headerTooltip: this.translateService.instant('entity.cartography.layerSet')
    };

    const serviceCol: any = this.utils.getRouterLinkColumnDef('entity.service.label', 'serviceName', 'service/:id/serviceForm', {id: 'serviceId'}, 160);
    serviceCol.sortable = true;
    serviceCol.cellRendererParams = {...serviceCol.cellRendererParams, sortField: 'service.name'};
    serviceCol.flex = 2;
    serviceCol.minWidth = 160;
    serviceCol.tooltipField = 'serviceName';

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      layerCol,
      serviceCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['layers', -1, 'layersForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['layers', -1, 'layersForm', id]);
  }

  override dataFetchFn = () => this.cartographyService.fetchAllProjectionItems(CartographyProjection);

  override dataUpdateFn = (data: CartographyProjection) => firstValueFrom(this.cartographyService.update(Cartography.fromObject(data))).then(cartography => CartographyProjection.fromObject(cartography));

  override dataDeleteFn = (data: CartographyProjection) => firstValueFrom(this.cartographyService.delete(Cartography.fromObject(data))).then(cartography => CartographyProjection.fromObject(cartography));
}
