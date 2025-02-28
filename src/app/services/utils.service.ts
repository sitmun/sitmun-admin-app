import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {Subject} from 'rxjs';
import {CodeListService, HalOptions, HalParam, Language, Translation, TranslationService} from '../frontend-core/src/lib/public_api';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DialogMessageComponent, DialogTranslationComponent} from '../frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {config} from 'src/config';
import {BtnCheckboxFilterComponent} from '../frontend-gui/src/lib/btn-checkbox-filter/btn-checkbox-filter.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  [x: string]: any;

  private subjectLoading = new Subject<boolean>();

  constructor(
    private translate: TranslateService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private location: Location,
    private translationService: TranslationService,
    private codeListService: CodeListService
  ) {
  }

  showMessage(message: string | string[]) {
    this.snackBar.open(this.translate.instant(message), '', {
      duration: 5000,
    });
  }

  getTranslate(msg: string | string[]) {
    return this.translate.instant(msg);
  }

  showErrorMessage(error: any) {
    console.error(error);
    let missatge = '';
    try {
      if (error.error && error.error.errors) {
        error.error.errors.forEach((element) => {
          missatge += this.translate.instant(
            'Property: ' + element.property + ' ' + element.message + ';'
          );
        });
      } else {
        missatge = this.translate.instant(
          error.error
            ? error.error.error + ': ' + error.error.message
            : error.message
        );
      }
    } catch (error) {
      missatge = error.toString();
    }
    console.error(missatge);
    this.snackBar
      .open(missatge, 'Cerrar', {
        duration: 0,
        panelClass: ['error-snackbar'],
      })
      .onAction()
      .subscribe(() => {
        this.snackBar.dismiss();
      });
  }

  /**
   * LOADING OBSERVABLE
   */
  enableLoading() {
    this.subjectLoading.next(true);
  }

  disableLoading() {
    this.subjectLoading.next(false);
  }

  getLoadingAsObservable() {
    return this.subjectLoading.asObservable();
  }

  /**
   * PRINT
   */
  print() {
    window.print();
  }

  /**
   * GO BACK
   */
  navigateBack() {
    this.location.back();
  }

  getCodeListValues(valueList, notTraduction?) {
    const params2: HalParam[] = [];
    let codelistLangValue = config.defaultLang;
    if (localStorage.lang) {
      codelistLangValue = localStorage.lang;
    }
    const param: HalParam = {key: 'codeListName', value: valueList};
    params2.push(param);
    if (!notTraduction) {
      const param2: HalParam = {key: 'lang', value: codelistLangValue};
      params2.push(param2);
    }
    const query: HalOptions = {params: params2};

    return this.codeListService.getAll(query);
  }

  getDateFormated(data) {
    return data.value ? new Date(data.value).toLocaleDateString() : '';
  }

  duplicateParameter(data, parameterToModify, ignoreId?, ignoreLinks?) {
    const elementsToDuplicate = [];
    data.forEach((element) => {
      const newElement = {...element};
      newElement[parameterToModify] = this.getTranslate('copy_').concat(
        newElement[parameterToModify]
      );
      if (!ignoreId) {
        newElement.id = null;
      }
      if (!ignoreLinks) {
        newElement._links = null;
      }
      elementsToDuplicate.push(newElement);
    });

    return elementsToDuplicate;
  }

  getDateFilterParams() {
    return {
      comparator: function(filterLocalDateAtMidnight, cellValue) {
        if (cellValue == null) {
          return -1;
        }
        const cellDate = new Date(cellValue);
        if (
          filterLocalDateAtMidnight.toLocaleDateString() ===
          cellDate.toLocaleDateString()
        ) {
          return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
      },
      browserDatePicker: true,
      minValidYear: 2000,
    };
  }

  //Update grids

  updateUriList(requestURI: string, data: any[], eventRefresh?) {
    this.http
      .put(requestURI, this.createUriList(data), {
        headers: new HttpHeaders({
          'Content-Type': 'text/uri-list',
          Charset: 'UTF-8',
        }),
      })
      .subscribe(
        () => {
          this.success = true;
          if (eventRefresh) {
            eventRefresh.next(true);
          }
        },
        () => {
          this.success = false;
        }
      );
  }

  createUriList(data: any[]) {
    let putRequestLine = '';
    data.forEach((item) => {
      putRequestLine += `${item}` + '\n';
    });

    return putRequestLine;
  }

  showTreeStructureError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('treeStructureMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showRequiredFieldsError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('requiredFieldMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showTuristicAppTreeError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('turisticAppTreeMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showNoTuristicAppTreeError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('noTuristicAppTreeMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showTuristicTreeAppError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('turisticTreeAppMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showNoTuristicTreeAppError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('noTuristicTreeAppMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showNavigationOutDialog() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('caution');
    dialogRef.componentInstance.message = this.getTranslate('navigateOutMessage');
    return dialogRef.afterClosed();
  }

  getSelCheckboxColumnDef() {
    return {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      editable: false,
      filter: false,
      minWidth: 45,
      maxWidth: 45,
      lockPosition: true,
    };
  }

  getArrayValueParser() {
    return {
      valueParser: (params) => {
        if (params.newValue === '') {
          return [];
        } else {
          return Array.isArray(params.newValue)
            ? params.newValue
            : params.newValue.split(',');
        }
      },
    };
  }

  getEditBtnColumnDef() {
    return {
      headerName: '',
      field: 'id',
      editable: false,
      filter: false,
      minWidth: 50,
      maxWidth: 50,
      lockPosition: true,
      cellRenderer: 'btnEditRendererComponent',
    };
  }

  /**
   * Generates a non-editable ID column definition.
   *
   * @param customId - An optional identifier.
   * @returns An object representing the column definition.
   */
  getIdColumnDef(customId?) {
    return {
      headerName: 'Id',
      field: customId ? customId : 'id',
      editable: false,
      cellClass: 'read-only-cell'
    };
  }

  getStatusColumnDef() {
    return {
      headerName: this.getTranslate('status'),
      field: 'status',
      filter: 'agTextColumnFilter',
      filterParams: {
        textFormatter: (filterValue) =>
          this.getTranslate(filterValue).toLowerCase(),
      },
      editable: false,
      valueFormatter: (params) => {
        if (params.value != undefined && params.value !== '') {
          return this.getTranslate(params.value);
        } else {
          return this.getTranslate('statusOK');
        }
      },
      cellClassRules: {
        pendingModify: function(params) {
          return params.value === 'pendingModify';
        },
        pendingDelete: function(params) {
          return params.value === 'pendingDelete';
        },
        pendingCreation: function(params) {
          return params.value === 'pendingCreation';
        },
        notAvailable: function(params) {
          return params.value === 'notAvailable';
        },
        pendingRegistration: function(params) {
          return params.value === 'pendingRegistration';
        },
        unregisteredLayer: function(params) {
          return params.value === 'unregisteredLayer';
        },
        stable: function(params) {
          return params.value === undefined || params.value === 'statusOK';
        },
      },
    };
  }

  getDateColumnDef(alias, field, editable?: boolean) {
    return {
      headerName: this.getTranslate(alias),
      field: field,
      filter: 'agDateColumnFilter',
      filterParams: this.getDateFilterParams(),
      editable: editable ? editable : false,
      cellRenderer: (data) => {
        return this.getDateFormated(data);
      },
      cellEditor: 'datePicker',
      minWidth: 140,
    };
  }

  getSelectColumnDef(
    alias,
    field,
    editable,
    elements,
    formatted?,
    formattedList?
  ) {
    let columnDef;
    if (formatted && formattedList) {
      columnDef = this.getFormattedColumnDef(alias, formattedList, field);
      columnDef.filter = 'agTextColumnFilter';
      columnDef.editable = editable;
      columnDef.field = field;
      columnDef.cellEditorParams = {
        values: elements,
      };
      columnDef.cellEditor = 'agSelectCellEditor';
      columnDef.minWidth = 140;
    } else {
      columnDef = {
        headerName: this.getTranslate(alias),
        field: field,
        filter: 'agTextColumnFilter',
        editable: editable,
        cellEditorParams: {
          values: elements,
        },
        cellEditor: 'agSelectCellEditor',
        minWidth: 140,
      };
    }
    return columnDef;
  }

  /**
   * Generates a column definition object for an editable column in a data grid.
   *
   * @param alias - The alias used to get the translated header name.
   * @param field - The field name in the data object that this column represents.
   * @returns An object representing the column definition.
   */
  getEditableColumnDef(alias, field) {
    return {
      headerName: this.getTranslate(alias),
      field: field,
      editable: true,
      valueGetter: (params) => {
        const value = params.data[field];
        return Array.isArray(value) ? value.join(',') : value;
      },
    };
  }

  /**
   * Generates a non-editable column definition with a code list for value formatting.
   *
   * @param alias - The alias used for translation of the header name.
   * @param field - The field name for the column.
   * @param codeList - The list of code-value pairs used to format the column values.
   * @returns An object representing the column definition.
   */
  getNonEditableColumnWithCodeListDef(alias, field, codeList) {
    const getDescription = (value: string) => {
      const item = codeList.find((x) => x.value === value);
      return item ? item.description : value;
    };

    return {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      valueFormatter: (params) => getDescription(params.value),
      cellClass: 'read-only-cell'
    };
  }

  /**
   * Generates a non-editable column definition.
   *
   * @param alias - The alias used for translation of the header name.
   * @param field - The field name for the column.
   * @returns An object representing the column definition.
   */
  getNonEditableColumnDef(alias, field) {
    return {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      cellClass: 'read-only-cell'
    };
  }

  getBooleanColumnDef(alias, field, editable) {
    return {
      headerName: this.getTranslate(alias),
      field: field,
      editable: editable,
      cellRenderer: 'btnCheckboxRendererComponent',
      floatingFilterComponent: BtnCheckboxFilterComponent,
      valueGetter: (params) => (params.data[field] ? 'true' : 'false'),
      floatingFilterComponentParams: {suppressFilterButton: true},
      minWidth: 110,
    };
  }

  getFormattedColumnDef(
    alias: string | string[],
    filterList: any[],
    field: string,
    fieldToCompare?: string,
    fieldToShow?: string
  ) {
    const fieldReturned = fieldToShow ? fieldToShow : 'description';
    return {
      headerName: this.getTranslate(alias),
      editable: false,
      valueGetter: (params) => {
        const alias = fieldToCompare
          ? filterList.filter(
            (format) => format[fieldToCompare] == params.data[field]
          )[0]
          : filterList.filter(
            (format: { value: any; }) => format.value == params.data[field]
          )[0];
        return alias != undefined ? alias[fieldReturned] : params.data[field];
      },
    };
  }

  //Translation

  createTranslationsList(columnName: string): Map<string, Translation> {
    const translationsList: Map<string, Translation> = new Map<
      string,
      Translation
    >();

    const languagesToUse = config.languagesToUse
      ? config.languagesToUse
      : JSON.parse(localStorage.getItem('languages'));
    if (languagesToUse) {
      languagesToUse.forEach((language: Language) => {
        const currentTranslation: Translation = new Translation();
        currentTranslation.translation = null;
        currentTranslation.column = columnName;
        currentTranslation.language = language;
        translationsList.set(language.shortname, currentTranslation);
      });
    }
    return translationsList;
  }

  async openTranslationDialog(translationsMap: Map<string, Translation>) {
    const dialogRef = this.dialog.open(DialogTranslationComponent, {
      panelClass: 'translateDialogs',
    });
    dialogRef.componentInstance.translationsMap = translationsMap;
    dialogRef.componentInstance.languageByDefault = config.defaultLang;
    dialogRef.componentInstance.languagesAvailables = config.languagesToUse;

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  updateTranslations(
    translationsMap: Map<string, Translation>,
    translations: Translation[]
  ) {
    translations.forEach((translation) => {
      translationsMap.set(translation.languageShortname, translation);
    });
    return translationsMap;
  }

  async saveTranslation(
    id: number,
    translationMap: Map<string, Translation>,
    internationalValue: string,
    modifications: boolean
  ) {
    const defaultLanguage = config.defaultLang;
    const promises: Promise<any>[] = [];
    if (translationMap) {
      translationMap.forEach((value: Translation, key: string) => {
        if (key == defaultLanguage && internationalValue) {
          value.element = id;
          value.translation = internationalValue;
          promises.push(
            new Promise((resolve) => {
              this.translationService.save(value).subscribe((result) => {
                translationMap.set(key, result);
                resolve(true);
              });
            })
          );
        } else if (modifications) {
          if (value && value.translation) {
            value.element = id;
            promises.push(
              new Promise((resolve,) => {
                this.translationService.save(value).subscribe((result) => {
                  translationMap.set(key, result);
                  resolve(true);
                });
              })
            );
          }
        }
      });
    }
    Promise.all(promises).then(() => {
      return translationMap;
    });
  }
}
