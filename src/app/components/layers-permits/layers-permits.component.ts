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
import {CartographyGroup, CartographyGroupService, CodeListService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {constants} from '@environments/constants';

@Component({
    selector: 'app-layers-permits',
    templateUrl: './layers-permits.component.html',
    styles: [],
    standalone: false
})
export class LayersPermitsComponent extends BaseListComponent<CartographyGroup> {
  entityListConfig: EntityListConfig<CartographyGroup> = {
    entityLabel: Configuration.LAYERS_PERMIT.labelPlural,
    iconName: Configuration.LAYERS_PERMIT.icon,
    font: Configuration.LAYERS_PERMIT.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    defaultColumnSorting: ['name'],
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.cartographyGroupService, {
      params: [{key: 'excludedType', value: constants.codeValue.cartographyPermissionType.backgroundMap}]
    }),
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
    public cartographyGroupService: CartographyGroupService
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
    await this.initCodeLists(['cartographyPermission.type']);
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'layersPermits/:id/layersPermitsForm', {id: 'id'}, 220);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 3;
    nameCol.tooltipField = 'name';

    const typeCol: any = this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', this.codeList('cartographyPermission.type'));
    typeCol.sortable = true;
    typeCol.cellRendererParams = {...typeCol.cellRendererParams, sortField: 'type'};
    typeCol.minWidth = 160;
    typeCol.flex = 1;

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      typeCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['layersPermits', -1, 'layersPermitsForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['layersPermits', -1, 'layersPermitsForm', id]);
  }

  override dataFetchFn = () => this.cartographyGroupService.fetchAllItems();

  override dataUpdateFn = (data: CartographyGroup) => firstValueFrom(this.cartographyGroupService.update(data))

  override dataDeleteFn = (data: CartographyGroup) => firstValueFrom(this.cartographyGroupService.delete(data))
}
