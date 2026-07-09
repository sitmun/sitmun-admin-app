import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

import {BaseListComponent} from "@app/components/base-list.component";
import {EntityListConfig} from "@app/components/shared/entity-list";
import {Configuration} from '@app/core/config/configuration';
import {CodeListService} from '@app/domain/codelist/services/codelist.service';
import {Language} from '@app/domain/translation/models/language.model';
import {LanguageService} from '@app/domain/translation/services/language.service';
import {TranslationService} from '@app/domain/translation/services/translation.service';
import {DIALOG_EVENTS, DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';
import {LoggerService} from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {config} from '@config';

@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styles: [],
    standalone: false
})
export class LanguageComponent extends BaseListComponent<Language> implements OnInit {
  private pendingOrderedLanguageIds: number[] = [];
  currentDefaultLanguage: string | null = null;

  entityListConfig: EntityListConfig<Language> = {
    entityLabel: Configuration.LANGUAGE.labelPlural,
    iconName: Configuration.LANGUAGE.icon,
    font: Configuration.LANGUAGE.font,
    columnDefs: [],
    dataFetchFn: () => this.languageService.fetchAllItems(),
    rowModelMode: 'clientSide',
    rowDragManaged: true,
    gridOptions: {
      discardChangesButton: false,
      redoButton: false,
      undoButton: false,
      applyChangesButton: true,
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
    const dragCol: any = {
      headerName: '',
      field: 'order',
      rowDrag: true,
      sortable: false,
      editable: false,
      filter: false,
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      suppressHeaderMenuButton: true,
      suppressMenu: true,
      cellClass: 'sitmun-centered-cell',
      headerClass: 'sitmun-centered-header',
      valueGetter: () => 'drag_indicator',
      cellRenderer: () => '<span class="material-icons-round">drag_indicator</span>'
    };

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
    nameCol.sortable = false;
    nameCol.flex = 1;
    nameCol.tooltipValueGetter = (params) => {
      const isDefault = params.data?.shortname === this.currentDefaultLanguage;
      return isDefault ? `${params.value} - Default database language` : params.value;
    };

    const defaultCol: any = this.utils.getBooleanColumnDef('entity.language.default', 'defaultLanguage', false, 150, 170);
    defaultCol.sortable = false;
    defaultCol.filter = false;

    this.entityListConfig.columnDefs = [
      this.utils.getRowCheckboxColumnDef(),
      dragCol,
      nameCol,
      defaultCol
    ];
  }

  onRowOrderChanged(rows: Language[]): void {
    this.pendingOrderedLanguageIds = rows.map((row) => row.id);
  }

  override sendChanges(_data: Language[]) {
    if (this.pendingOrderedLanguageIds.length === 0) {
      return;
    }

    this.loadingOverlay.wrap(
      async () => {
        await firstValueFrom(this.languageService.reorder(this.pendingOrderedLanguageIds));
        config.languagesToUse = await firstValueFrom(this.languageService.fetchAllItems());
        localStorage.setItem('languages', JSON.stringify(config.languagesToUse));
        this.pendingOrderedLanguageIds = [];
        this.refreshCommandEvent$.next(true);
      },
      { message: this.translateService.instant('entity.language.reorderSaving') }
    );
  }

  override async newData() {
    await this.router.navigate(['language', -1, 'languageForm']);
  }

  override async duplicateItem(id: number) {
    await this.router.navigate(['language', -1, 'languageForm', id]);
  }

  override removeData(data: Language[]) {
    if (data.some((language) => language.defaultLanguage)) {
      const dialogRef = this.dialog.open(DialogMessageComponent, {
        width: '420px',
        data: {
          title: 'common.atention',
          message: 'entity.language.defaultDeleteWarning',
          hideCancelButton: true,
        },
      });
      dialogRef.afterClosed().subscribe();
      return;
    }

    const dialogRef = this.dialog.open(DialogMessageComponent, {
      width: '460px',
      data: {
        title: 'common.delete.title',
        message: 'entity.language.deleteWithLiteralTranslationsWarning',
        destructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event !== DIALOG_EVENTS.ACCEPT) {
        return;
      }

      this.loadingOverlay.wrap(
        async () => {
          const results = await Promise.allSettled(
            data.map((item) => this.dataDeleteFn(item))
          );

          results.forEach((deleteResult, index) => {
            if (deleteResult.status === 'rejected') {
              this.loggerService.error(`Failed to delete language ${data[index]?.id}:`, deleteResult.reason);
            }
          });

          this.refreshCommandEvent$.next(true);
        },
        { message: this.translateService.instant('common.deleting') }
      );
    });
  }

  override dataUpdateFn = (data: Language) => firstValueFrom(this.languageService.update(data))

  override dataDeleteFn = (data: Language) => firstValueFrom(this.languageService.delete(data))
}
