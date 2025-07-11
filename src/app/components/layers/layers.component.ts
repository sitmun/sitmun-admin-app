import {Component} from '@angular/core';
import {
  Cartography,
  CartographyProjection,
  CartographyService,
  CodeListService,
  TranslationService,
} from '@app/domain';
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
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styles: []
})
export class LayersComponent extends BaseListComponent<CartographyProjection> {
  entityListConfig: EntityListConfig<CartographyProjection> = {
    entityLabel: Configuration.LAYER.labelPlural,
    iconName: Configuration.LAYER.icon,
    font: Configuration.LAYER.font,
    columnDefs: [],
    dataFetchFn: () => this.cartographyService.getAllProjection(CartographyProjection),
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
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'layers/:id/layersForm', {id: 'id'}, 200, 300),
      {...this.utils.getNonEditableColumnDef('entity.cartography.layerSet', 'layers', 200, 300), ...this.utils.getArrayValueParser()},
      this.utils.getRouterLinkColumnDef('entity.service.label', 'serviceName', 'service/:id/serviceForm', {id: 'serviceId'}, 200, 300),
    ];
  }

  override async newData() {
    await this.router.navigate(['layers', -1, 'layersForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['layers', -1, 'layersForm', id]);
  }

  override dataFetchFn = () => this.cartographyService.getAllProjection(CartographyProjection);

  override dataUpdateFn = (data: CartographyProjection) => firstValueFrom(this.cartographyService.update(Cartography.fromObject(data))).then(cartography => CartographyProjection.fromObject(cartography));

  override dataDeleteFn = (data: CartographyProjection) => firstValueFrom(this.cartographyService.delete(Cartography.fromObject(data))).then(cartography => CartographyProjection.fromObject(cartography));
}
