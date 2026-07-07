import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {createPagedInfiniteFetcher} from '@app/core/hal';
import {INFINITE_PAGE_SIZE_DEFAULT} from '@app/core/hal/infinite-page-size';
import {CodeListService} from '@app/domain/codelist/services/codelist.service';
import {Language} from '@app/domain/translation/models/language.model';
import {LanguageService} from '@app/domain/translation/services/language.service';
import {TranslationService} from '@app/domain/translation/services/translation.service';
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
export class LanguageComponent extends BaseListComponent<Language> implements OnInit {
  currentDefaultLanguage: string | null = null;

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

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override async preFetchData(): Promise<void> {
    try {
      this.currentDefaultLanguage = await firstValueFrom(this.languageService.getCurrentDefaultLanguage());
    } catch (err) {
      this.errorHandler.handleError(err);
    }
  }

  override async postFetchData(): Promise<void> {
    const nameCol: any = {
      ...this.utils.getRouterLinkColumnDef('entity.language.name', 'name', 'language/:id/languageForm', {id: 'id'}, 220),
      valueGetter: (params) => {
        const name = params.data?.name || '';
        const shortname = params.data?.shortname || '';
        const isDefault = params.data?.shortname === this.currentDefaultLanguage;
        const defaultMarker = isDefault ? ' ★' : '';
        return shortname ? `${name} (${shortname})${defaultMarker}` : name;
      }
    };
    nameCol.sortable = true;
    nameCol.cellRendererParams = {...nameCol.cellRendererParams, sortField: 'name'};
    nameCol.flex = 1;
    nameCol.tooltipValueGetter = (params) => {
      const isDefault = params.data?.shortname === this.currentDefaultLanguage;
      return isDefault ? `${params.value} - Default database language` : params.value;
    };

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      nameCol
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
