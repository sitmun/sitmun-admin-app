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
import {CodeListService, Connection, ConnectionService, TranslationService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-connection',
    templateUrl: './connection.component.html',
    styles: [],
    standalone: false
})
export class ConnectionComponent extends BaseListComponent<Connection> {
  entityListConfig: EntityListConfig<Connection> = {
    entityLabel: Configuration.CONNECTION.labelPlural,
    iconName: Configuration.CONNECTION.icon,
    font: Configuration.CONNECTION.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.connectionService),
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
    public connectionService: ConnectionService
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
    const nameCol: any = this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'connection/:id/connectionForm', {id: 'id'}, 130, 250);
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    const driverCol: any = this.utils.getNonEditableColumnWithCodeListDef('entity.connection.driver', 'driver', this.codeList('databaseConnection.driver'));
    driverCol.sortable = true;
    driverCol.cellRendererParams = {...driverCol.cellRendererParams, sortField: 'driver'};

    const urlCol: any = this.utils.getNonEditableColumnDef('entity.connection.url', 'url', 130, 250);
    urlCol.sortable = true;
    urlCol.cellRendererParams = {...urlCol.cellRendererParams, sortField: 'url'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
      driverCol,
      urlCol,
    ];
  }

  override async newData(){
    await this.router.navigate(['connection', -1, 'connectionForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['connection', -1, 'connectionForm', id]);
  }

  override dataUpdateFn = (data: Connection) => firstValueFrom(this.connectionService.update(data))

  override dataDeleteFn = (data: Connection) => firstValueFrom(this.connectionService.delete(data))
}
