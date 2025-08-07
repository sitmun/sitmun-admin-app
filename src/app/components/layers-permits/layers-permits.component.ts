import {Component} from '@angular/core';
import {CartographyGroup, CartographyGroupService, CodeListService, TranslationService,} from '@app/domain';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {firstValueFrom, map} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {constants} from '@environments/constants';

@Component({
  selector: 'app-layers-permits',
  templateUrl: './layers-permits.component.html',
  styles: [],
})
export class LayersPermitsComponent extends BaseListComponent<CartographyGroup> {
  override dataFetchFn = () => this.cartographyGroupService.getAll().pipe(
    map((groups) => groups.filter(group => group.type !== constants.codeValue.cartographyPermissionType.backgroundMap))
  );

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
      router
    );
  }

  override async preFetchData(): Promise<void> {
    await this.initCodeLists(['cartographyPermission.type']);
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'layersPermits/:id/layersPermitsForm', {id: 'id'}),
      this.utils.getNonEditableColumnWithCodeListDef('common.form.type', 'type', this.codeList('cartographyPermission.type')),
    ];
  }

  override async newData() {
    await this.router.navigate(['layersPermits', -1, 'layersPermitsForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['layersPermits', -1, 'layersPermitsForm', id]);
  }

  entityListConfig: EntityListConfig<CartographyGroup> = {
    entityLabel: Configuration.LAYERS_PERMIT.labelPlural,
    iconName: Configuration.LAYERS_PERMIT.icon,
    font: Configuration.LAYERS_PERMIT.font,
    columnDefs: [],
    dataFetchFn: () => this.dataFetchFn(),
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

  override dataUpdateFn = (data: CartographyGroup) => firstValueFrom(this.cartographyGroupService.update(data))

  override dataDeleteFn = (data: CartographyGroup) => firstValueFrom(this.cartographyGroupService.delete(data))
}
