import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AgGridModule } from '@ag-grid-community/angular';
import { CellClickedEvent, ColDef, FilterChangedEvent, GridApi, GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, forkJoin, tap } from 'rxjs';

import {
  LiteralTranslationCreateDialogComponent,
  LiteralTranslationCreateDialogResult,
} from '@app/components/literal-translations/literal-translation-create-dialog/literal-translation-create-dialog.component';
import {
  LiteralTranslationCsvDialogComponent,
  LiteralTranslationCsvDialogResult,
} from '@app/components/literal-translations/literal-translation-csv-dialog/literal-translation-csv-dialog.component';
import { LiteralTranslationItem } from '@app/components/literal-translations/literal-translation.model';
import { CanComponentDeactivate } from '@app/core/guards/can-deactivate-guard.service';
import { createInfiniteDatasource } from '@app/core/hal/infinite-datasource';
import { INFINITE_PAGE_SIZE_DEFAULT } from '@app/core/hal/infinite-page-size';
import { Language, sortLanguagesByOrder } from '@app/domain/translation/models/language.model';
import { LanguageService } from '@app/domain/translation/services/language.service';
import { DialogMessageComponent, DIALOG_EVENTS } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {
  LiteralTranslationsAdminService,
  LiteralTranslationCsvImportResponse,
  LiteralTranslationUpsertPayload,
} from '@app/services/literal-translations-admin.service';
import { filterEnabledLanguages } from '@app/services/ui-language.resolver';
import { config } from '@config';

ModuleRegistry.registerModules([InfiniteRowModelModule]);

@Component({
  selector: 'app-literal-translations',
  templateUrl: './literal-translations.component.html',
  styleUrls: ['./literal-translations.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TranslateModule, AgGridModule],
})
export class LiteralTranslationsComponent implements CanComponentDeactivate, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild('detailCard', { read: ElementRef }) private readonly detailCard?: ElementRef<HTMLElement>;

  readonly pageSize = INFINITE_PAGE_SIZE_DEFAULT;
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly languageControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly form = new FormGroup({
    id: new FormControl<number | null>(null),
    literal: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    translation: new FormControl('', { nonNullable: true }),
    sourceLanguage: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  readonly selectionColumnDef: ColDef<LiteralTranslationItem> = {
    headerName: '',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: (params) => !!params.data,
    filter: false,
    floatingFilter: false,
    editable: false,
    headerClass: 'sitmun-centered-header',
    cellClass: 'sitmun-centered-cell',
    cellStyle: { padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    lockPosition: true,
    suppressMovable: true,
    resizable: false,
    width: 56,
    minWidth: 56,
    maxWidth: 56,
    flex: 0,
  };

  languages: Language[] = [];
  langCompletionPct: number = 0;

  get defaultLanguage(): string {
    return config.defaultLang;
  }
  readonly columnDefs: ColDef<LiteralTranslationItem>[] = [
    this.selectionColumnDef,
    {
      field: 'literal',
      headerValueGetter: () => this.translateService.instant('entity.literalTranslation.literalColumn'),
      filter: true,
      filterParams: {
        buttons: ['reset'],
      },
      sortable: true,
      flex: 1,
      minWidth: 220,
      tooltipField: 'literal',
    },
    {
      field: 'translation',
      headerValueGetter: () => this.translateService.instant('entity.literalTranslation.translationColumn'),
      filter: true,
      filterParams: {
        buttons: ['reset'],
      },
      sortable: false,
      flex: 1,
      minWidth: 220,
      valueGetter: (params) => this.isSelectedLanguageSourceLanguage(params.data) ? params.data?.literal ?? '' : params.data?.translation ?? '',
      tooltipValueGetter: (params) => params.value,
    },
    {
      field: 'complete',
      headerName: '',
      width: 72,
      maxWidth: 72,
      cellRenderer: (params: { data: LiteralTranslationItem | undefined }) =>
        params.data
          ? `<span class="complete-indicator complete-indicator-${params.data.complete}" title="${this.getCompletionIndicatorTooltip(params.data)}"></span>`
          : '',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    },
    {
      colId: 'editAction',
      headerName: '',
      width: 72,
      maxWidth: 72,
      sortable: false,
      cellRenderer: (params: { data: LiteralTranslationItem | undefined }) =>
        params.data ? '<span style="padding-top: 66%;" class="material-icons-round sitmun-inline-edit-icon">edit</span>' : '',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    },
  ];
  readonly loadingOverlayTemplate = `
    <div class="literal-translations-grid-overlay" role="presentation">
      <span class="literal-translations-grid-spinner" aria-hidden="true"></span>
    </div>
  `;

  private getCompletionIndicatorTooltip(data: LiteralTranslationItem): string {
    return data.complete
      ? this.translateService.instant('entity.literalTranslation.completeTooltip')
      : this.translateService.instant('entity.literalTranslation.incompleteTooltip');
  }

  gridApi: GridApi<LiteralTranslationItem> | null = null;
  generation = 0;
  selectedRows: LiteralTranslationItem[] = [];
  editingItemId: number | null = null;
  saving = false;
  deleting = false;
  csvBusy = false;
  hasActiveColumnFilters = false;

  constructor(
    private readonly literalTranslationsService: LiteralTranslationsAdminService,
    private readonly languageService: LanguageService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {
    this.syncTranslationControlState();

    this.searchControl.valueChanges.pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.refreshGrid();
    });

    this.languageControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearSelection();
      this.syncTranslationControlState();
      this.refreshGrid();
      this.getCompletionPct();
    });

    this.form.controls.literal.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((literal) => {
      if (this.isEditingSelectedSourceLanguage()) {
        this.form.controls.translation.setValue(literal, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.loadLanguages();
  }

  onGridReady(event: GridReadyEvent<LiteralTranslationItem>): void {
    this.gridApi = event.api;
    this.refreshGrid();
  }

  get noRowsOverlayTemplate(): string {
    return this.translateService.instant('common.form.noData');
  }

  get orderedLanguages(): Language[] {
    return sortLanguagesByOrder(this.languages);
  }

  onFilterChanged(event: FilterChangedEvent<LiteralTranslationItem>): void {
    this.hasActiveColumnFilters = event.api.isAnyFilterPresent();
  }

  onSelectionChanged(): void {
    this.selectedRows = this.gridApi?.getSelectedRows() ?? [];
  }

  onCellClicked(event: CellClickedEvent<LiteralTranslationItem>): void {
    if (event.colDef.colId !== 'editAction' || !event.data) {
      return;
    }
    this.openEditor(event.data, true);
  }

  clearFilters(): void {
    if (!this.gridApi) {
      return;
    }

    this.gridApi.setFilterModel(null);
    this.hasActiveColumnFilters = false;
  }

  createNew(): void {
    const dialogRef = this.dialog.open(LiteralTranslationCreateDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: {
        languages: this.orderedLanguages,
        defaultLanguage: this.defaultLanguage,
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: LiteralTranslationCreateDialogResult | null) => {
      if (!result) {
        return;
      }
      this.saving = true;
      this.literalTranslationsService.create({
        literal: result.literal,
        language: result.sourceLanguage,
        sourceLanguage: result.sourceLanguage,
        translation: result.literal,
        translations: result.translations,
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.saving = false;
          this.clearSelection();
          this.refreshGrid();
          this.getCompletionPct();
          this.snackBar.open(this.translateService.instant('entity.literalTranslation.saveSuccess'), undefined, { duration: 2500 });
        },
        error: () => {
          this.saving = false;
        },
      });
    });
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.buildPayload();
    const id = this.form.controls.id.value;
    const request$ = id == null
      ? this.literalTranslationsService.create(payload)
      : this.literalTranslationsService.update(id, payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (item) => {
          this.saving = false;
          this.openEditor(item);
          this.refreshGrid();
          this.getCompletionPct();
          this.snackBar.open(this.translateService.instant('entity.literalTranslation.saveSuccess'), undefined, { duration: 2500 });
        },
      error: () => {
        this.saving = false;
      },
    });
  }

  deleteSelected(): void {
    const selectedRows = this.gridApi?.getSelectedRows() ?? this.selectedRows;
    if (selectedRows.length === 0 || this.deleting) {
      return;
    }

    const dialogRef = this.dialog.open(DialogMessageComponent, {
      width: '400px',
      data: {
        title: 'common.delete.title',
        message: 'common.delete.message',
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result?.event !== DIALOG_EVENTS.ACCEPT) {
        return;
      }
      this.deleting = true;
      forkJoin(selectedRows.map((row) => this.literalTranslationsService.delete(row.id)))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.deleting = false;
            this.clearSelection();
            this.refreshGrid();
            this.getCompletionPct();
            this.snackBar.open(this.translateService.instant('entity.literalTranslation.deleteSuccess'), undefined, { duration: 2500 });
          },
          error: () => {
            this.deleting = false;
          },
        });
    });
  }

  isSelectedLanguageSourceLanguage(item: LiteralTranslationItem | null | undefined): boolean {
    return !!item?.sourceLanguage && this.languageControl.value === item.sourceLanguage;
  }

  isEditing(): boolean {
    return this.editingItemId != null;
  }

  private refreshGrid(): void {
    if (!this.gridApi) {
      return;
    }
    this.selectedRows = [];
    this.gridApi.deselectAll();
    this.generation += 1;
    const currentGeneration = this.generation;
    this.showGridLoadingOverlay();
    this.gridApi.setDatasource(
      createInfiniteDatasource(
        (request) => this.literalTranslationsService.fetchPage(request, this.languageControl.value).pipe(
          tap({
            next: (page) => {
              if (!this.gridApi || request.page !== 0 || currentGeneration !== this.generation) {
                return;
              }
              if (page.totalElements === 0) {
                this.gridApi.showNoRowsOverlay();
                return;
              }
              this.gridApi.hideOverlay();
            },
            error: () => {
              if (this.gridApi && request.page === 0 && currentGeneration === this.generation) {
                this.gridApi.hideOverlay();
              }
            },
          }),
        ),
        {
          pageSize: this.pageSize,
          columnDefs: this.columnDefs.map((columnDef) => {
            const agValueGetter = columnDef.valueGetter;
            const valueGetter = typeof agValueGetter === 'function'
              ? ((params: { data: unknown }) => agValueGetter(params as never))
              : undefined;
            return {
              ...columnDef,
              field: typeof columnDef.field === 'string' ? columnDef.field : undefined,
              colId: columnDef.colId,
              valueGetter,
            };
          }),
          gridApi: this.gridApi,
          getGeneration: () => this.generation,
          backendSearch: {
            enabled: true,
            getSearchText: () => this.searchControl.value,
          },
        },
      ),
    );
  }

  private showGridLoadingOverlay(): void {
    this.gridApi?.showLoadingOverlay();
  }

  private getCompletionPct() {
    this.literalTranslationsService.fetchCompletionPct(this.languageControl.value)
      .subscribe(pct => this.langCompletionPct = pct);
  }

  private clearSelection(): void {
    this.selectedRows = [];
    this.gridApi?.deselectAll();
    this.closeEditor();
  }

  closeEditor(): void {
    this.editingItemId = null;
    this.form.reset(
      {
        id: null,
        literal: '',
        translation: '',
        sourceLanguage: '',
      },
      { emitEvent: false },
    );
    this.syncTranslationControlState();
  }

  private openEditor(item: LiteralTranslationItem, scrollToEditor = false): void {
    this.editingItemId = item.id;
    this.form.patchValue(
      {
        id: item.id,
        literal: item.literal,
        translation: this.isSelectedLanguageSourceLanguage(item) ? item.literal : item.translation ?? '',
        sourceLanguage: item.sourceLanguage,
      },
      { emitEvent: false },
    );
    this.syncTranslationControlState();

    if (scrollToEditor && this.shouldAutoScrollToEditor()) {
      setTimeout(() => {
        this.detailCard?.nativeElement?.scrollIntoView({behavior: 'smooth', block: 'start'});
      }, 0);
    }
  }

  private syncTranslationControlState(): void {
    if (this.isEditingSelectedSourceLanguage()) {
      this.form.controls.translation.setValue(this.form.controls.literal.value, { emitEvent: false });
      this.form.controls.translation.disable({ emitEvent: false });
      return;
    }
    this.form.controls.translation.enable({ emitEvent: false });
  }

  private buildPayload(): LiteralTranslationUpsertPayload {
    return {
      literal: this.form.controls.literal.value,
      translation: this.isEditingSelectedSourceLanguage() ? this.form.controls.literal.value : this.form.controls.translation.value,
      language: this.languageControl.value,
      sourceLanguage: this.form.controls.sourceLanguage.value,
    };
  }

  private isEditingSelectedSourceLanguage(): boolean {
    const sourceLanguage = this.form.controls.sourceLanguage.value;
    return !!sourceLanguage && this.languageControl.value === sourceLanguage;
  }

  private resolveInitialLanguage(): string {
    const preferred = localStorage.getItem('lang');
    if (preferred && this.languages.some((language) => language.shortname === preferred)) {
      return preferred;
    }
    const firstNonDefault = this.languages.find((language) => language.shortname !== this.defaultLanguage);
    return firstNonDefault?.shortname ?? this.defaultLanguage;
  }

  private loadLanguages(): void {
    this.languageService.fetchAllItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (languages) => {
          this.languages = filterEnabledLanguages([...languages]);
          const current = this.languageControl.value;
          const nextLanguage = this.languages.some((language) => language.shortname === current)
            ? current
            : this.resolveInitialLanguage();
          this.languageControl.setValue(nextLanguage, { emitEvent: false });
          this.syncTranslationControlState();
          this.refreshGrid();
          this.getCompletionPct();
        },
      });
  }

  importCsv(): void {
    const dialogRef = this.dialog.open(LiteralTranslationCsvDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      data: {
        mode: 'import',
        languages: this.languages,
        language: this.languageControl.value,
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: LiteralTranslationCsvDialogResult | null) => {
      if (!result?.file) {
        return;
      }
      this.csvBusy = true;
      this.literalTranslationsService.importCsv(result.language, result.file)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.csvBusy = false;
            this.refreshGrid();
            this.getCompletionPct();
            this.openImportSummary(response);
          },
          error: () => {
            this.csvBusy = false;
          },
        });
    });
  }

  exportCsv(): void {
    const literalIds = this.selectedRows.length > 0 ? this.selectedRows.map((row) => row.id) : undefined;
    const dialogRef = this.dialog.open(LiteralTranslationCsvDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      data: {
        mode: 'export',
        languages: this.languages,
        language: this.languageControl.value,
        literalIds,
        fileName: this.defaultCsvFileName(this.languageControl.value, literalIds),
      },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: LiteralTranslationCsvDialogResult | null) => {
      if (!result) {
        return;
      }
      this.csvBusy = true;
      this.literalTranslationsService.exportCsv({
        targetLanguage: result.language,
        literalIds: result.literalIds,
        fileName: result.fileName,
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          this.csvBusy = false;
          const fileName = this.resolveExportFileName(response.headers.get('content-disposition'), result.fileName ?? this.defaultCsvFileName(result.language, result.literalIds));
          this.downloadCsv(response.body ?? new Blob(), fileName);
        },
        error: () => {
          this.csvBusy = false;
        },
      });
    });
  }

  private shouldAutoScrollToEditor(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 1919px)').matches;
  }

  private defaultCsvFileName(targetLanguage: string, literalIds?: number[]): string {
    return `literal-translations-${targetLanguage}${literalIds && literalIds.length > 0 ? '-partial' : ''}.csv`;
  }

  private resolveExportFileName(contentDisposition: string | null, fallback: string): string {
    if (!contentDisposition) {
      return fallback;
    }

    const filenameMatch = /filename\*=UTF-8''([^;]+)|filename\*?="?([^";]+)"?/i.exec(contentDisposition);
    const candidate = filenameMatch?.[1] ?? filenameMatch?.[2];
    try {
      return candidate ? decodeURIComponent(candidate) : fallback;
    } catch {
      return fallback;
    }
  }

  private downloadCsv(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 0);
  }

  private openImportSummary(response: LiteralTranslationCsvImportResponse): void {
    const sourceLanguages = response.sourceLanguages ?? [];
    const errors = response.errors ?? [];
    const lines = [
      this.translateService.instant('entity.literalTranslation.csv.summary.targetLanguage', { lang: response.targetLanguage }),
      this.translateService.instant('entity.literalTranslation.csv.summary.totalRows', { count: response.totalRows }),
      this.translateService.instant('entity.literalTranslation.csv.summary.createdLiterals', { count: response.createdLiterals }),
      this.translateService.instant('entity.literalTranslation.csv.summary.createdTranslations', { count: response.createdTranslations }),
      this.translateService.instant('entity.literalTranslation.csv.summary.updatedTranslations', { count: response.updatedTranslations }),
      this.translateService.instant('entity.literalTranslation.csv.summary.emptiedTranslations', { count: response.emptiedTranslations }),
      this.translateService.instant('entity.literalTranslation.csv.summary.unchangedRows', { count: response.unchangedRows }),
      this.translateService.instant('entity.literalTranslation.csv.summary.existingKeysNotInCsv', { count: response.existingKeysNotInCsv }),
      this.translateService.instant('entity.literalTranslation.csv.summary.emptyValueRows', { count: response.emptyValueRows }),
      this.translateService.instant('entity.literalTranslation.csv.summary.failedRows', { count: response.failedRows }),
    ];

    if (sourceLanguages.length > 0) {
      lines.push(
        this.translateService.instant('entity.literalTranslation.csv.summary.sourceLanguages', {
          languages: sourceLanguages.join(', '),
        }),
      );
    }

    if (errors.length > 0) {
      lines.push(this.translateService.instant('entity.literalTranslation.csv.summary.errors'));
      for (const error of errors) {
        lines.push(
          `#${error.rowNumber}${error.sourceLanguage ? ` [${error.sourceLanguage}]` : ''}${error.literal ? ` ${error.literal}` : ''}: ${this.translateService.instant(error.message)}`,
        );
      }
    }

    this.dialog.open(DialogMessageComponent, {
      width: '720px',
      data: {
        title: 'entity.literalTranslation.csv.summary.title',
        message: lines.join('\n'),
        hideCancelButton: true,
        acceptLabel: 'common.button.close',
      },
    });
  }

  canDeactivate(): boolean {
    return true;
  }
}
