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
import {CodeListService, TerritoryType, TerritoryTypeService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-territory-type',
    templateUrl: './territory-type.component.html',
    styles: [],
    standalone: false
})
export class TerritoryTypeComponent extends BaseListComponent<TerritoryType> {
  entityListConfig: EntityListConfig<TerritoryType> = {
    entityLabel: Configuration.TERRITORY_TYPE.labelPlural,
    iconName: Configuration.TERRITORY_TYPE.icon,
    font: Configuration.TERRITORY_TYPE.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.territoryTypeService),
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
    public territoryTypeService: TerritoryTypeService
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
    const nameCol: any = {
      ...this.utils.getRouterLinkColumnDef(
        'entity.territoryType.name',
        'name',
        'territoryType/:id/territoryTypeForm',
        {id: 'id'},
        220
      ),
      valueGetter: (params) => params.data?.name || '',
    };
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 1;
    nameCol.tooltipValueGetter = (params) => params.value;

    const officialCol: any = this.utils.getBooleanColumnDef(
      'entity.territoryType.official',
      'official',
      false,
      120,
      120
    );
    officialCol.sortable = true;
    officialCol.cellRendererParams = {...officialCol.cellRendererParams, sortField: 'official'};
    officialCol.flex = 0;

    const topTypeCol: any = this.utils.getBooleanColumnDef(
      'entity.territoryType.topType',
      'topType',
      false,
      120,
      120
    );
    topTypeCol.sortable = true;
    topTypeCol.cellRendererParams = {...topTypeCol.cellRendererParams, sortField: 'topType'};
    topTypeCol.flex = 0;

    const bottomTypeCol: any = this.utils.getBooleanColumnDef(
      'entity.territoryType.bottomType',
      'bottomType',
      false,
      120,
      120
    );
    bottomTypeCol.sortable = true;
    bottomTypeCol.cellRendererParams = {...bottomTypeCol.cellRendererParams, sortField: 'bottomType'};
    bottomTypeCol.flex = 0;

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      officialCol,
      topTypeCol,
      bottomTypeCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['territoryType', -1, 'territoryTypeForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['territoryType', -1, 'territoryTypeForm', id]);
  }

  override dataUpdateFn = (data: TerritoryType) => firstValueFrom(this.territoryTypeService.update(data));

  override dataDeleteFn = (data: TerritoryType) => firstValueFrom(this.territoryTypeService.delete(data));
}
