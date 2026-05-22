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
import {CodeList, CodeListService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-codelist-value',
    templateUrl: './codelist-value.component.html',
    styles: [],
    standalone: false
})
export class CodelistValueComponent extends BaseListComponent<CodeList> {
  entityListConfig: EntityListConfig<CodeList> = {
    entityLabel: Configuration.CODELIST_VALUE.labelPlural,
    iconName: Configuration.CODELIST_VALUE.icon,
    font: Configuration.CODELIST_VALUE.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.codeListService),
    progressiveLocalFilter: false,
    backendSearch: true,
    defaultColumnSorting: ['codeListName', 'value'],
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
    const codeListNameCol: any = this.utils.getNonEditableColumnDef('entity.codelistValue.codeListName', 'codeListName', 180);
    codeListNameCol.sortable = true;
    codeListNameCol.cellRendererParams = {...codeListNameCol.cellRendererParams, sortField: 'codeListName'};
    codeListNameCol.flex = 2;
    codeListNameCol.cellClass = 'read-only-cell sitmun-technical-cell';
    codeListNameCol.tooltipField = 'codeListName';

    const descriptionCol: any = {
      ...this.utils.getRouterLinkColumnDef('entity.codelistValue.description', 'description', 'codelistValue/:id/codelistValueForm', {id: 'id'}, 260),
      valueGetter: (params) => {
        const description = params.data?.description || '';
        const value = params.data?.value || '';
        return value ? `${description} (${value})` : description;
      }
    };
    descriptionCol.sortable = true;
    descriptionCol.cellRendererParams = {...descriptionCol.cellRendererParams, sortField: 'description'};
    descriptionCol.flex = 4;
    descriptionCol.tooltipValueGetter = (params) => params.value;

    const defaultCodeCol: any = this.utils.getBooleanColumnDef('entity.codelistValue.defaultCode', 'defaultCode', false, 160, 160);
    defaultCodeCol.sortable = true;
    defaultCodeCol.cellRendererParams = {...defaultCodeCol.cellRendererParams, sortField: 'defaultCode'};
    defaultCodeCol.width = 160;
    defaultCodeCol.flex = 0;

    const systemCol: any = this.utils.getBooleanColumnDef('entity.codelistValue.system', 'system', false, 112, 112);
    systemCol.sortable = true;
    systemCol.cellRendererParams = {...systemCol.cellRendererParams, sortField: 'system'};
    systemCol.width = 112;
    systemCol.flex = 0;

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      codeListNameCol,
      descriptionCol,
      defaultCodeCol,
      systemCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['codelistValue', -1, 'codelistValueForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['codelistValue', -1, 'codelistValueForm', id]);
  }

  override dataUpdateFn = (data: CodeList) => firstValueFrom(this.codeListService.update(data))

  override dataDeleteFn = (data: CodeList) => {
    // Prevent deletion of system records
    if (data.system) {
      this.errorHandler.handleError(new Error(this.translateService.instant('entity.codelistValue.error.cannotDeleteSystem')));
      return Promise.reject(new Error('Cannot delete system code list value'));
    }
    return firstValueFrom(this.codeListService.delete(data));
  }
}
