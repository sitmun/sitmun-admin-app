import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent, ModuleRegistry } from '@ag-grid-community/core';
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';
import { AgGridModule } from '@ag-grid-community/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, forkJoin } from 'rxjs';

import { DialogMessageComponent, DIALOG_EVENTS } from '@app/frontend-gui/src/lib/public_api';
import { CanComponentDeactivate } from '@app/core/guards/can-deactivate-guard.service';
import { createInfiniteDatasource } from '@app/core/hal/infinite-datasource';
import { INFINITE_PAGE_SIZE_DEFAULT } from '@app/core/hal/infinite-page-size';
import { Language, LanguageService } from '@app/domain';
import { MaterialModule } from '@app/material-module';
import { LiteralTranslationItem } from '@app/components/literal-translations/literal-translation.model';
import {
  LiteralTranslationCreateDialogComponent,
  LiteralTranslationCreateDialogResult,
} from '@app/components/literal-translations/literal-translation-create-dialog.component';
import {
  LiteralTranslationsAdminService,
  LiteralTranslationUpsertPayload,
} from '@app/services/literal-translations-admin.service';
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
  readonly defaultLanguage = config.defaultLang;
  readonly columnDefs: ColDef<LiteralTranslationItem>[] = [
    this.selectionColumnDef,
    {
      field: 'literal',
      headerValueGetter: () => this.translateService.instant('entity.literalTranslation.literalColumn'),
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: 220,
      tooltipField: 'literal',
    },
    {
      field: 'translation',
      headerValueGetter: () => this.translateService.instant('entity.literalTranslation.translationColumn'),
      filter: true,
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
      cellRenderer: (params: { data: LiteralTranslationItem }) =>
        `<span class="complete-indicator complete-indicator-${params.data?.complete}" title="${params.data?.complete ? this.translateService.instant('entity.literalTranslation.completeTooltip') : this.translateService.instant('entity.literalTranslation.incompleteTooltip')}"></span>`,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    },
    {
      colId: 'editAction',
      headerName: '',
      width: 72,
      maxWidth: 72,
      sortable: false,
      cellRenderer: () => '<span style="padding-top: 66%;" class="material-icons-round sitmun-inline-edit-icon">edit</span>',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    },
  ];

  gridApi: GridApi<LiteralTranslationItem> | null = null;
  generation = 0;
  selectedRows: LiteralTranslationItem[] = [];
  editingItemId: number | null = null;
  saving = false;
  deleting = false;

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

  onSelectionChanged(): void {
    this.selectedRows = this.gridApi?.getSelectedRows() ?? [];
  }

  onCellClicked(event: CellClickedEvent<LiteralTranslationItem>): void {
    if (event.colDef.colId !== 'editAction' || !event.data) {
      return;
    }
    this.openEditor(event.data, true);
  }

  createNew(): void {
    const dialogRef = this.dialog.open(LiteralTranslationCreateDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: {
        languages: this.languages,
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
    this.gridApi.setDatasource(
      createInfiniteDatasource(
        (request) => this.literalTranslationsService.fetchPage(request, this.languageControl.value),
        {
          pageSize: this.pageSize,
          columnDefs: this.columnDefs.map((columnDef) => {
            const agValueGetter = columnDef.valueGetter;
            const valueGetter = typeof agValueGetter === 'function'
              ? ((params: { data: unknown }) => agValueGetter(params as never))
              : undefined;
            return {
              field: typeof columnDef.field === 'string' ? columnDef.field : undefined,
              colId: columnDef.colId,
              valueGetter,
            };
          }),
          gridApi: this.gridApi,
          getGeneration: () => this.generation,
          progressiveLocalFilter: {
            enabled: true,
            getSearchText: () => this.searchControl.value,
            matches: (row: unknown, searchText: string) => {
              const item = row as LiteralTranslationItem;
              const haystack = `${item.literal ?? ''} ${item.translation ?? ''}`.toLocaleLowerCase();
              return haystack.includes(searchText);
            },
          },
        },
      ),
    );
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
          this.languages = [...languages].sort((a, b) => a.shortname.localeCompare(b.shortname));
          const current = this.languageControl.value;
          const nextLanguage = this.languages.some((language) => language.shortname === current)
            ? current
            : this.resolveInitialLanguage();
          this.languageControl.setValue(nextLanguage, { emitEvent: false });
          this.syncTranslationControlState();
          this.refreshGrid();
        },
      });
  }

  private shouldAutoScrollToEditor(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 1919px)').matches;
  }

  canDeactivate(): boolean {
    return true;
  }
}
