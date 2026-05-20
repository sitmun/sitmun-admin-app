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
import {
  CodeListService,
  Territory,
  TerritoryService,
  TerritoryType,
  TerritoryTypeService,
  TranslationService,
} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';


@Component({
    selector: 'app-territory',
    templateUrl: './territory.component.html',
    styles: [],
    standalone: false
})
export class TerritoryComponent extends BaseListComponent<Territory> {
  territoryTypes: TerritoryType[] = [];

  entityListConfig: EntityListConfig<Territory> = {
    entityLabel: Configuration.TERRITORY.labelPlural,
    iconName: Configuration.TERRITORY.icon,
    font: Configuration.TERRITORY.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.territoryService),
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
    public territoryService: TerritoryService,
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

  override async preFetchData(): Promise<void> {
    this.territoryTypes = await firstValueFrom(this.territoryTypeService.fetchAllItems())
  }

  override async postFetchData(): Promise<void> {
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'territory/:id/territoryForm', {id: 'id'}, 130, 250);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    const codeCol: any = this.utils.getEditableColumnDef('entity.territory.code', 'code', 130, 250);
    codeCol.sortable = true;
    codeCol.cellRendererParams = {...codeCol.cellRendererParams, sortField: 'code'};

    const typeCol: any = this.utils.getFormattedColumnDef('common.form.type', () => this.territoryTypes, 'typeId', 'id', 'name');
    typeCol.sortable = true;
    typeCol.cellRendererParams = {...typeCol.cellRendererParams, sortField: 'typeId'};

    const dateCol: any = this.utils.getDateColumnDef('common.form.createdDate', 'createdDate');
    dateCol.sortable = true;
    dateCol.cellRendererParams = {...dateCol.cellRendererParams, sortField: 'createdDate'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      codeCol,
      typeCol,
      dateCol
    ];
  }

  override async newData() {
    await this.router.navigate(['territory', -1, 'territoryForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['territory', -1, 'territoryForm', id]);
  }

  override dataUpdateFn = (data: Territory) => firstValueFrom(this.territoryService.update(data))

  override dataDeleteFn = (data: Territory) => firstValueFrom(this.territoryService.delete(data))
}
