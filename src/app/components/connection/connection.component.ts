import {Component} from '@angular/core';
import {CodeListService, Connection, ConnectionService, TranslationService,} from '@app/domain';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styles: [],
})
export class ConnectionComponent extends BaseListComponent<Connection> {
  entityListConfig: EntityListConfig<Connection> = {
    entityLabel: Configuration.CONNECTION.labelPlural,
    iconName: Configuration.CONNECTION.icon,
    font: Configuration.CONNECTION.font,
    columnDefs: [],
    dataFetchFn: () => this.connectionService.getAll(),
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
      router
    );
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['databaseConnection.driver']);
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'connection/:id/connectionForm', {id: 'id'}),
      this.utils.getNonEditableColumnWithCodeListDef('entity.connection.driver', 'driver', this.codeList('databaseConnection.driver')),
      this.utils.getNonEditableColumnDef('entity.connection.url', 'url'),
    ];
  }

  override async newData(){
    await this.router.navigate(['connection', -1, 'connectionForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['connection', -1, 'connectionForm', id]);
  }

  override dataFetchFn = () => this.connectionService.getAll();

  override dataUpdateFn = (data: Connection) => firstValueFrom(this.connectionService.update(data))

  override dataDeleteFn = (data: Connection) => firstValueFrom(this.connectionService.delete(data))
}
