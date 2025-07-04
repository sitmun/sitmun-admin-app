import {Component} from '@angular/core';
import {CodeListService, Service, ServiceService, TranslationService,} from '@app/domain';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styles: [],
})
export class ServiceComponent extends BaseListComponent<Service> {
  entityListConfig: EntityListConfig<Service> = {
    entityLabel: 'entity.connection.label',
    iconName: 'menu_servei',
    columnDefs: [],
    dataFetchFn: () => this.serviceService.getAll(),
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
    public serviceService: ServiceService
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
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'service/:id/serviceForm', {id: 'id'}),
      this.utils.getNonEditableColumnDef('common.form.type', 'type'),
      this.utils.getNonEditableColumnWithLinkDef('entity.service.endpoint', 'serviceURL'),
    ];
  }

  override async newData() {
    await this.router.navigate(['service', -1, 'serviceForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['service', -1, 'serviceForm', id]);
  }

  override dataFetchFn = () => this.serviceService.getAll();

  override dataUpdateFn = (data: Service) => firstValueFrom(this.serviceService.update(data))

  override dataDeleteFn = (data: Service) => firstValueFrom(this.serviceService.delete(data))
}
