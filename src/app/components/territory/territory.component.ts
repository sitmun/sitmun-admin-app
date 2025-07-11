import {Component} from '@angular/core';
import {
  CodeListService,
  Territory,
  TerritoryService,
  TerritoryType,
  TerritoryTypeService,
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
  selector: 'app-territory',
  templateUrl: './territory.component.html',
  styles: []
})
export class TerritoryComponent extends BaseListComponent<Territory> {
  territoryTypes: TerritoryType[] = [];

  entityListConfig: EntityListConfig<Territory> = {
    entityLabel: Configuration.TERRITORY.labelPlural,
    iconName: Configuration.TERRITORY.icon,
    font: Configuration.TERRITORY.font,
    columnDefs: [],
    dataFetchFn: () => this.territoryService.getAll(),
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
      router
    );
  }

  override async preFetchData(): Promise<void> {
    this.territoryTypes = await firstValueFrom(this.territoryTypeService.getAll())
  }

  override async postFetchData(): Promise<void> {
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'territory/:id/territoryForm', {id: 'id'}),
      this.utils.getEditableColumnDef('entity.territory.code', 'code'),
      this.utils.getFormattedColumnDef('common.form.type', this.territoryTypes, 'typeId', 'id', 'name'),
      this.utils.getDateColumnDef('common.form.createdDate', 'createdDate')
    ];
  }

  override async newData() {
    await this.router.navigate(['territory', -1, 'territoryForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['territory', -1, 'territoryForm', id]);
  }

  override dataFetchFn = () => this.territoryService.getAll();

  override dataUpdateFn = (data: Territory) => firstValueFrom(this.territoryService.update(data))

  override dataDeleteFn = (data: Territory) => firstValueFrom(this.territoryService.delete(data))
}
