import {Component, Injectable, Injector} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Location} from '@angular/common';
import {firstValueFrom, Subject} from 'rxjs';
import {CodeList, CodeListService, Language, Translation, TranslationService} from '@app/domain';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DialogMessageComponent, DialogTranslationComponent} from '@app/frontend-gui/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {config} from '@config';
import {BtnCheckboxFilterComponent} from '@app/frontend-gui/src/lib/btn-checkbox-filter/btn-checkbox-filter.component';
import {LoggerService} from '@app/services/logger.service';
import {HalOptions, HalParam} from '@app/core/hal/rest/rest.service';
import {ICellRendererAngularComp} from '@ag-grid-community/angular';

/**
 * A utility service that provides common functionality across the application.
 * This service includes methods for:
 * - Message handling and display
 * - Loading state management
 * - Navigation
 * - Data formatting and manipulation
 * - Dialog management
 * - Grid column definitions
 * - Translation management
 */
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  [x: string]: any;

  private subjectLoading = new Subject<boolean>();

  private translationService: TranslationService;

  private codeListService: CodeListService;

  constructor(
    private readonly translate: TranslateService,
    public dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly http: HttpClient,
    private readonly location: Location,
    private readonly injector: Injector,
    private loggerService: LoggerService
  ) {
    // Lazy load services to break circular dependency
    setTimeout(() => {
      this.translationService = this.injector.get(TranslationService);
      this.codeListService = this.injector.get(CodeListService);
    });
  }

  /**
   * Displays a snackbar message that automatically dismisses after 5 seconds.
   * @param message - The message to display. Can be a string or array of strings that will be translated.
   */
  showMessage(message: string | string[]) {
    this.loggerService.debug('showMessage', message);
    this.snackBar.open(this.translate.instant(message), '', {
      duration: 5000,
    });
  }

  /**
   * Translates a given message key using the translation service.
   * @param msg - The message key to translate.
   * @returns The translated string.
   */
  getTranslate(msg: string | string[]) {
    return this.translate.instant(msg);
  }

  /**
   * Displays an error message in a snackbar that requires user dismissal.
   * Handles different error formats and translates error messages.
   * @param error - The error object to process and display.
   */
  showErrorMessage(error: any) {
    console.trace(error);
    let msg = '';
    try {
      if (error.error && error.error.errors) {
        error.error.errors.forEach((element) => {
          msg += this.translate.instant(
            'Property: ' + element.property + ' ' + element.message + ';'
          );
        });
      } else {
        msg = this.translate.instant(
          error.error
            ? error.error.error + ': ' + error.error.message
            : error.message
        );
      }
    } catch (error) {
      msg = error.toString();
    }
    this.loggerService.debug('showMessage', msg);
    this.snackBar
      .open(msg, 'Cerrar', {
        duration: 0,
        panelClass: ['error-snackbar'],
      })
      .onAction()
      .subscribe(() => {
        this.snackBar.dismiss();
      });
  }

  showSimpleErrorMessage(message: string) {
    this.loggerService.debug('showSimpleErrorMessage', message);
    this.snackBar
      .open(message, 'Cerrar', {
        duration: 0,
        panelClass: ['error-snackbar'],
      })
      .onAction()
      .subscribe(() => {
        this.snackBar.dismiss();
      });
  }

  /**
   * Enables the loading state of the application.
   * Notifies subscribers that loading has started.
   */
  enableLoading() {
    this.subjectLoading.next(true);
  }

  /**
   * Disables the loading state of the application.
   * Notifies subscribers that loading has finished.
   */
  disableLoading() {
    this.subjectLoading.next(false);
  }

  /**
   * Gets the loading state as an Observable.
   * @returns An Observable that emits boolean values indicating loading state.
   */
  getLoadingAsObservable() {
    return this.subjectLoading.asObservable();
  }

  /**
   * Triggers the browser's print functionality.
   */
  print() {
    window.print();
  }

  /**
   * Navigates back to the previous page in the browser history.
   */
  navigateBack() {
    this.location.back();
  }

  /**
   * Retrieves code list values from the server.
   * @param valueList - The name of the code list to retrieve.
   * @param notTraduction - Optional flag to indicate if translation is not needed.
   * @returns An Observable of the code list values.
   */
  getCodeListValues(valueList, notTraduction?) {
    if (!this.codeListService) {
      this.codeListService = this.injector.get(CodeListService);
    }
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

  /**
   * Formats a date object to a localized string.
   * @param data - The date object to format.
   * @returns A formatted date string or empty string if no date provided.
   */
  getDateFormated(data) {
    return data.value ? new Date(data.value).toLocaleDateString() : '';
  }

  /**
   * Creates duplicates of elements in an array with modified parameters.
   * @param data - Array of elements to duplicate.
   * @param parameterToModify - Parameter to modify in the duplicated elements.
   * @param ignoreId - Optional flag to keep original IDs.
   * @param ignoreLinks - Optional flag to keep original links.
   * @returns Array of duplicated elements.
   */
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

  /**
   * Gets date filter parameters for AG Grid date columns.
   * @returns Object containing date filter configuration.
   */
  getDateFilterParams() {
    return {
      comparator: function (filterLocalDateAtMidnight, cellValue) {
        if (cellValue == null) {
          return -1;
        }
        const cellDate = new Date(cellValue);
        if (
          filterLocalDateAtMidnight.getFullYear() === cellDate.getFullYear() &&
          filterLocalDateAtMidnight.getMonth() === cellDate.getMonth() &&
          filterLocalDateAtMidnight.getDate() === cellDate.getDate()
        ) {
          return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
        // Default return if none of the conditions are met
        return 0;
      },
      browserDatePicker: true,
      minValidYear: 2000,
    };
  }

  /**
   * Updates a list of URIs on the server using a PUT request.
   * @param requestURI - The endpoint URL where the URI list will be updated.
   * @param data - Array of URI strings to be sent to the server.
   * @param eventRefresh - Optional Subject to notify when the update is complete.
   */
  updateUriList(requestURI: string, data: string[], eventRefresh?: Subject<boolean>) {
    const body = data.join('\n');

    this.http
      .put(requestURI, body, {
        headers: new HttpHeaders({
          'Content-Type': 'text/uri-list',
          Charset: 'UTF-8',
        }),
      })
      .subscribe({
        next: () => {
          if (eventRefresh) {
            eventRefresh.next(true);
          }
        },
        error: (error) => {
          this.loggerService.error('Error updating URI list', error);
          throw error;
        },
      });
  }

  /**
   * Shows a dialog with a tree structure error message.
   */
  showTreeStructureError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('treeStructureMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Shows a dialog with a required fields error message.
   */
  showRequiredFieldsError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('requiredFieldMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Shows a dialog with a turistic app tree error message.
   */
  showTuristicAppTreeError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('turisticAppTreeMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Shows a dialog with a no turistic app tree error message.
   */
  showNoTuristicAppTreeError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('noTuristicAppTreeMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Shows a dialog with a turistic tree app error message.
   */
  showTuristicTreeAppError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('turisticTreeAppMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Shows a dialog with a no turistic tree app error message.
   */
  showNoTuristicTreeAppError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('atention');
    dialogRef.componentInstance.message = this.getTranslate('noTuristicTreeAppMessage');
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  /**
   * Shows a navigation out confirmation dialog.
   * @returns Observable that resolves when the dialog is closed.
   */
  showNavigationOutDialog() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('caution');
    dialogRef.componentInstance.message = this.getTranslate('navigateOutMessage');
    return dialogRef.afterClosed();
  }

  /**
   * Gets the column definition for a checkbox selection column in AG Grid.
   * @returns Column definition object for checkbox selection.
   */
  getSelCheckboxColumnDef() {
    return {
      headerName: '',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: false,
      floatingFilter: false,
      editable: false,
      lockPosition: true,
      suppressMovable: true,
      resizable: false,
      maxWidth: 80,
    };
  }

  /**
   * Gets a value parser for array values in AG Grid.
   * @returns Value parser configuration object.
   */
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

  /**
   * Gets the column definition for an edit button column in AG Grid.
   * @returns Column definition object for edit button.
   */
  getEditBtnColumnDef() {
    return {
      headerName: '',
      field: 'id',
      editable: false,
      sortable: false,
      filter: false,
      floatingFilter: false,
      lockPosition: true,
      suppressMovable: true,
      cellRenderer: 'btnEditRendererComponent',
      maxWidth: 90,
      minWidth: 90,
    };
  }

  /**
   * Gets the column definition for an ID column in AG Grid.
   * @param customId - Optional custom ID field name.
   * @returns Column definition object for ID column.
   */
  getIdColumnDef(customId?) {
    return {
      headerName: 'Id',
      field: customId ?? 'id',
      editable: false,
      cellClass: 'read-only-cell',
      lockPosition: true,
      maxWidth: 90,
      minWidth: 90,
    };
  }

  /**
   * Gets the column definition for a status column in AG Grid.
   * @returns Column definition object for status column.
   */
  getStatusColumnDef() {
    return {
      maxWidth: 180,
      minWidth: 180,
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
        pendingModify: function (params) {
          return params.value === 'pendingModify';
        },
        pendingDelete: function (params) {
          return params.value === 'pendingDelete';
        },
        pendingCreation: function (params) {
          return params.value === 'pendingCreation';
        },
        notAvailable: function (params) {
          return params.value === 'notAvailable';
        },
        pendingRegistration: function (params) {
          return params.value === 'pendingRegistration';
        },
        unregisteredLayer: function (params) {
          return params.value === 'unregisteredLayer';
        },
        stable: function (params) {
          return params.value === undefined || params.value === 'statusOK';
        },
      },
    };
  }

  /**
   * Gets the column definition for a date column in AG Grid.
   * @param alias - Translation key for column header.
   * @param field - Field name in data object.
   * @param editable - Optional flag to make column editable.
   * @returns Column definition object for date column.
   */
  getDateColumnDef(alias, field, editable?: boolean) {
    return {
      headerName: this.getTranslate(alias),
      field: field,
      filter: 'agDateColumnFilter',
      filterParams: this.getDateFilterParams(),
      editable: editable ?? false,
      cellRenderer: (data) => {
        return this.getDateFormated(data);
      },
      cellEditor: 'datePicker',
    };
  }

  getNonEditableDateColumnDef(alias, field) {
    return this.getDateColumnDef(alias, field, false)
  }


  /**
   * Gets the column definition for a select column in AG Grid.
   * @param alias - Translation key for column header.
   * @param field - Field name in data object.
   * @param editable - Flag to make column editable.
   * @param elements - Array of selectable options.
   * @param formatted - Optional flag for formatted values.
   * @param formattedList - Optional list for formatting values.
   * @returns Column definition object for select column.
   */
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
      };
    }
    return columnDef;
  }

  /**
   * Helper method to extract values from an object using property paths.
   * @param data - The data object to extract values from.
   * @param field - The field or property path (e.g., "properties.scope").
   * @returns The extracted value or empty string if path does not exist.
   */
  private getValueFromPropertyPath(data: any, field: string): any {
    if (!data) return '';

    // Handle property paths (e.g., "properties.scope")
    if (field.includes('.')) {
      const paths = field.split('.');
      let value = data;

      for (const path of paths) {
        if (value === null || value === undefined) return '';
        value = value[path];
      }

      return value;
    }

    // Handle regular fields
    return data[field];
  }

  /**
   * Generates a column definition object for an editable column in a data grid.
   *
   * @param alias - The alias used to get the translated header name.
   * @param field - The field name in the data object that this column represents.
   * @param minWidth
   * @param maxWidth
   * @param minWidth
   * @param maxWidth
   * @returns An object representing the column definition.
   */
  getEditableColumnDef(alias, field, minWidth: number = null, maxWidth: number = null) {
    const options = {
      headerName: this.getTranslate(alias),
      field: field,
      editable: true,
      valueGetter: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        return Array.isArray(value) ? value.join(',') : value;
      },
    };
    if (minWidth) {
      options['minWidth'] = minWidth;
    }
    if (maxWidth) {
      options['maxWidth'] = maxWidth;
      options['wrapText'] = true;
      options['autoHeight'] = true;
    }
    return options
  }

  isUrl = (value: string): boolean => {
    if (!value || typeof value !== 'string') return false;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };


  /**
   * Generates a column definition object for an editable column that renders as a link.
   * The link is clickable but the text can also be edited.
   *
   * @param alias - The alias used to get the translated header name.
   * @param field - The field name in the data object that this column represents.
   * @param minWidth - Optional minimum width for the column.
   * @param maxWidth - Optional maximum width for the column.
   * @param openInNewTab - Optional flag to control if links open in new tab. Defaults to true.
   * @returns An object representing the column definition.
   */
  getEditableColumnWithLinkDef(alias, field, minWidth: number = null, maxWidth: number = null, openInNewTab = true) {

    const options = {
      headerName: this.getTranslate(alias),
      field: field,
      editable: true,
      cellRenderer: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        if (!value) return '';

        if (this.isUrl(value)) {
          const target = openInNewTab ? '_blank' : '_self';
          const icon = openInNewTab ? '<span class="external-link-icon">↗</span>' : '';
          return `<a href="${value}" target="${target}" class="url-link">${value} ${icon}</a>`;
        }
        return value;
      },
      valueGetter: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        return Array.isArray(value) ? value.join(',') : value;
      },
    };
    if (minWidth) {
      options['minWidth'] = minWidth;
    }
    if (maxWidth) {
      options['maxWidth'] = maxWidth;
      options['wrapText'] = true;
      options['autoHeight'] = true;
    }
    return options;
  }

  /**
   * Generates a non-editable column definition with a code list for value formatting.
   *
   * @param alias - The alias used for translation of the header name.
   * @param field - The field name for the column.
   * @param codeList - The list of code-value pairs used to format the column values.
   * @returns An object representing the column definition.
   */
  getNonEditableColumnWithCodeListDef(alias, field, codeList: any) {
    const getDescription = (value: string) => {
      let item: CodeList;
      if (Array.isArray(codeList)) {
        item = (codeList as CodeList[]).find((x) => x.value === value);
      } else {
        item = (codeList as () => CodeList[])().find((x) => x.value === value);
      }
      return item ? item.description : value;
    };

    return {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      valueFormatter: (params) => {
        const fieldValue = this.getValueFromPropertyPath(params.data, field);
        if (fieldValue == null) {
          return '';
        }
        return getDescription(fieldValue);
      },
      cellClass: 'read-only-cell'
    };
  }

  /**
   * Generates a non-editable column definition with a code list for value formatting.
   *
   * @param alias - The alias used for translation of the header name.
   * @param field - The field name for the column.
   * @param descriptionProvider
   * @returns An object representing the column definition.
   */
  getNonEditableColumnWithProviderDef(alias, field, descriptionProvider: (any) => string ) {
    return {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      valueFormatter: (params) => {
        this.loggerService.debug('getNonEditableColumnWithProviderDef', params.data, field);
        const fieldValue = this.getValueFromPropertyPath(params.data, field);
        if (fieldValue == null) {
          return '';
        }
        return this.getTranslate(descriptionProvider(fieldValue));
      },
      cellClass: 'read-only-cell'
    };
  }


  /**
   * Generates a non-editable column definition.
   *
   * @param alias - The alias used for translation of the header name.
   * @param field - The field name for the column, which can be a property path.
   * @param minWidth
   * @param maxWidth
   * @param minWidth
   * @param maxWidth
   * @returns An object representing the column definition.
   */
  getNonEditableColumnDef(alias, field, minWidth: number = null, maxWidth: number = null) {
    const options = {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      cellClass: 'read-only-cell',
      valueGetter: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        return Array.isArray(value) ? value.join(',') : value;
      },
    };
    if (minWidth) {
      options['minWidth'] = minWidth;
    }
    if (maxWidth) {
      options['maxWidth'] = maxWidth;
      options['wrapText'] = true;
      options['autoHeight'] = true;
    }
    return options;
  }

  /**
   * Generates a non-editable column definition that displays URLs as hyperlinks.
   *
   * @param alias - The alias used for translation of the header name.
   * @param field - The field name for the column, which can be a property path.
   * @param minWidth - Optional minimum width for the column.
   * @param maxWidth - Optional maximum width for the column.
   * @param openInNewTab - Optional flag to control if links open in new tab. Defaults to true.
   * @returns An object representing the column definition.
   */
  getNonEditableColumnWithLinkDef(alias, field, minWidth: number = null, maxWidth: number = null, openInNewTab = true) {

    const options = {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      cellClass: 'read-only-cell',
      cellRenderer: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        if (!value) return '';

        if (this.isUrl(value)) {
          const target = openInNewTab ? '_blank' : '_self';
          const icon = openInNewTab ? '<span class="external-link-icon">↗</span>' : '';
          return `<a href="${value}" target="${target}" class="url-link">${value} ${icon}</a>`;
        }
        return value;
      },
      valueGetter: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        return Array.isArray(value) ? value.join(',') : value;
      },
    };
    if (minWidth) {
      options['minWidth'] = minWidth;
    }
    if (maxWidth) {
      options['maxWidth'] = maxWidth;
      options['wrapText'] = true;
      options['autoHeight'] = true;
    }
    return options;
  }

  getBooleanColumnDef(alias, field, editable, minWidth: number = null, maxWidth: number = null, autoUnsetOthers = false) {
    const options = {
      headerName: this.getTranslate(alias),
      field: field,
      editable: editable,
      cellRenderer: 'btnCheckboxRendererComponent',
      floatingFilterComponent: BtnCheckboxFilterComponent,
      valueGetter: (params) => {
        const value = this.getValueFromPropertyPath(params.data, field);
        return value ? 'true' : 'false';
      },
      floatingFilterComponentParams: {suppressFilterButton: true},
      onCellValueChanged: autoUnsetOthers ? (params) => {
        if (params.newValue) {
          // If setting to true, set all other rows to false
          params.api.forEachNode((node) => {
            if (node.id !== params.node.id) {
              node.data[field] = false;
            }
          });
          params.api.refreshCells({ force: true });
        }
      } : undefined
    };
    if (minWidth) {
      options['minWidth'] = minWidth;
    }
    if (maxWidth) {
      options['maxWidth'] = maxWidth;
      options['wrapText'] = true;
      options['autoHeight'] = true;
    }
    return options;
  }

  addConditionToColumnDef(options: any, condition: (params: any) => boolean) {
    const originalCellRenderer = options.cellRenderer;
    options.cellRendererSelector = (params) => {
      if (condition(params)) {
        return { component: originalCellRenderer, params: params }
      }
      return { component: EmptyRendererComponent, params: params };
    };
    return options;
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
        const fieldValue = this.getValueFromPropertyPath(params.data, field);
        const alias = fieldToCompare
          ? filterList.filter(
            (format) => format[fieldToCompare] == fieldValue
          )[0]
          : filterList.filter(
            (format: { value: any; }) => format.value == fieldValue
          )[0];
        return alias != undefined ? alias[fieldReturned] : fieldValue;
      },
    };
  }

  /**
   * Gets the column definition for a router link column in AG Grid.
   * @param alias - Translation key for column header
   * @param field - Field name in data object to display as link text
   * @param route - Base route path with parameters (e.g. '/taskQuery/:id/:type')
   * @param paramFields - Object mapping route parameters to data fields (e.g. {id: 'id', type: 'type'})
   * @param minWidth - Optional minimum width for the column
   * @param maxWidth - Optional maximum width for the column
   * @returns Column definition object for router link column
   */
  getRouterLinkColumnDef(
    alias: string,
    field: string,
    route: string,
    paramFields: { [key: string]: string },
    minWidth?: number,
    maxWidth?: number
  ) {
    const options = {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      cellRenderer: 'routerLinkRenderer',
      cellRendererParams: {
        route: route,
        paramFields: paramFields
      },
      valueGetter: (params) => {
        return this.getValueFromPropertyPath(params.data, field);
      }
    };

    if (minWidth) {
      options['minWidth'] = minWidth;
    }
    if (maxWidth) {
      options['maxWidth'] = maxWidth;
      options['wrapText'] = true;
      options['autoHeight'] = true;
    }

    return options;
  }

  //Translation

  /**
   * Creates a list of translations for a column.
   * @param columnName - Name of the column to create translations for.
   * @returns Map of language codes to Translation objects.
   */
  createTranslationsList(columnName: string): Map<string, Translation> {
    const translationsList: Map<string, Translation> = new Map<
      string,
      Translation
    >();

    const languagesToUse = config.languagesToUse ?? JSON.parse(localStorage.getItem('languages'));
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

  /**
   * Opens a dialog for editing translations.
   * @param translationsMap - Map of current translations.
   * @returns Promise that resolves with updated translations or null if cancelled.
   */
  async openTranslationDialog(translationsMap: Map<string, Translation>) {
    const dialogRef = this.dialog.open(DialogTranslationComponent, {
      panelClass: 'translateDialogs',
    });
    dialogRef.componentInstance.translationsMap = translationsMap;
    dialogRef.componentInstance.languageByDefault = config.defaultLang;
    dialogRef.componentInstance.languagesAvailables = config.languagesToUse;

    return await firstValueFrom(dialogRef.afterClosed());
  }

  /**
   * Updates a translations map with new translation values.
   * @param translationsMap - Current translations map.
   * @param translations - Array of new translations.
   * @returns Updated translations map.
   */
  updateTranslations(
    translationsMap: Map<string, Translation>,
    translations: Translation[]
  ) {
    translations.forEach((translation) => {
      translationsMap.set(translation.languageShortname, translation);
    });
    return translationsMap;
  }

  /**
   * Saves translations to the server.
   * @param id - Element ID associated with translations.
   * @param translationMap - Map of translations to save.
   * @param internationalValue - Default language value.
   * @param modifications - Flag indicating if modifications were made.
   * @returns Promise that resolves with updated translations map.
   */
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

@Component({
  selector: 'app-empty-renderer',
  standalone: true,
  template: '<div></div>'
})
export class EmptyRendererComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }
}
