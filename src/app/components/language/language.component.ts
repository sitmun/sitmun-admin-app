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
import {CodeListService, Language, LanguageService, TranslationService} from '@app/domain';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';

@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styles: [],
    standalone: false
})
export class LanguageComponent extends BaseListComponent<Language> {
  entityListConfig: EntityListConfig<Language> = {
    entityLabel: Configuration.LANGUAGE.labelPlural,
    iconName: Configuration.LANGUAGE.icon,
    font: Configuration.LANGUAGE.font,
    columnDefs: [],
    dataFetchFn: () => of([]),
    rowModelMode: 'infinite',
    pageSize: INFINITE_PAGE_SIZE_DEFAULT,
    infiniteBlockFetcher: createPagedInfiniteFetcher(this.languageService),
    progressiveLocalFilter: false,
    backendSearch: true,
    defaultColumnSorting: ['shortname'],
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
    public languageService: LanguageService
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
    const nameCol: any = {
      ...this.utils.getRouterLinkColumnDef('entity.language.name', 'name', 'language/:id/languageForm', {id: 'id'}, 130, 250),
      valueGetter: (params) => {
        const name = params.data?.name || '';
        const shortname = params.data?.shortname || '';
        return shortname ? `${name} (${shortname})` : name;
      }
    };
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol,
    ];
  }

  override async newData() {
    await this.router.navigate(['language', -1, 'languageForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['language', -1, 'languageForm', id]);
  }

  override dataUpdateFn = (data: Language) => firstValueFrom(this.languageService.update(data))

  override dataDeleteFn = (data: Language) => firstValueFrom(this.languageService.delete(data))
}
