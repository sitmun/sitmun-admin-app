import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {CodeListService, TranslationService, Tree, TreeService,} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-trees',
    templateUrl: './trees.component.html',
    styles: [],
    standalone: false
})
export class TreesComponent extends BaseListComponent<Tree> {
  entityListConfig: EntityListConfig<Tree> = {
    entityLabel: Configuration.TREE.labelPlural,
    iconName: Configuration.TREE.icon,
    font: Configuration.TREE.font,
    columnDefs: [],
    dataFetchFn: () => this.treeService.getAll(),
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
    protected override loadingOverlay: LoadingOverlayService,
    public treeService: TreeService
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
    // Set column definitions directly in the config
    this.entityListConfig.columnDefs = [
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getRouterLinkColumnDef('common.form.name', 'name', 'trees/:id/treesForm', {id: 'id'}),
    ];
  }

  override async newData() {
    await this.router.navigate(['trees', -1, 'treesForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['trees', -1, 'treesForm', id]);
  }

  override dataFetchFn = () => this.treeService.getAll();

  override dataUpdateFn = (data: Tree) => firstValueFrom(this.treeService.update(data))

  override dataDeleteFn = (data: Tree) => firstValueFrom(this.treeService.delete(data))
}
