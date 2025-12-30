import {HalOptions, HalParam, Resource} from '@app/core';
import {Component, OnInit} from '@angular/core';
import {CodeList, CodeListService, TranslationService,} from '@app/domain';
import {UtilsService} from '@app/services/utils.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {config} from '@config';
import {EMPTY, firstValueFrom, Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DIALOG_EVENTS, DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {LoadingOverlayService} from '@app/services/loading-overlay.service';

@Component({
  template: '',
  styles: [],
})
export abstract class BaseListComponent<T extends Resource>
  implements OnInit
{
  refreshCommandEvent$: Subject<boolean> = new Subject<boolean>();
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  gridModified = false;
  columnDefs: any[] = [];

  /**
   * Configuration object for AG Grid theme styling.
   * Contains theme-specific settings from the global configuration.
   */
  themeGrid: any = config.agGridTheme;

  /**
   * Flag indicating whether all required data has been loaded.
   * Used to control the rendering of form elements and prevent premature operations.
   * Components should set this to true once all necessary data is available.
   */
  dataLoaded = false;

  /** Map of code list names to their associated values */
  private readonly codelists: Map<string, CodeList[]> = new Map();

  /**
   * Creates an instance of SitmunBaseComponent.
   *
   * @param {MatDialog} dialog - Angular Material dialog service for opening modal dialogs
   * @param {TranslateService} translateService - Angular service for handling i18n translations
   * @param {TranslationService} translationService - Service for managing entity translations
   * @param {CodeListService} codeListService - Service for retrieving code lists
   * @param loggerService
   * @param {ErrorHandlerService} errorHandler - Service for handling and displaying errors
   * @param {ActivatedRoute} activatedRoute - Angular service for accessing route parameters
   * @param utils
   * @param {Router} router - Angular service for navigation
   * @param {LoadingOverlayService} loadingOverlay - Service for showing loading overlay during operations
   */
  protected constructor(
    protected dialog: MatDialog,
    protected translateService: TranslateService,
    protected translationService: TranslationService,
    protected codeListService: CodeListService,
    protected loggerService: LoggerService,
    protected errorHandler: ErrorHandlerService,
    protected activatedRoute: ActivatedRoute,
    protected utils: UtilsService,
    protected router: Router,
    protected loadingOverlay: LoadingOverlayService
  ) {}

  ngOnInit(): void {
    this.fetchData()
      .then(() => this.afterFetch())
      .catch((reason) =>
        this.errorHandler.handleError(reason, 'common.error.initialization')
      );
  }

  async fetchData(): Promise<void> {
    try {
      await this.preFetchData();
      await this.doFetchData();
      await this.postFetchData();
      this.dataLoaded = true;
    } catch (error) {
      this.errorHandler.handleError(error, 'common.error.loadingFailed');
    }
  }

  async afterFetch(): Promise<void> {
    return Promise.resolve();
  }

  async preFetchData(): Promise<void> {
    return Promise.resolve();
  }

  async doFetchData(): Promise<void> {
    return Promise.resolve();
  }

  async postFetchData(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Retrieves all values for a specific code list.
   *
   * @param {string} code - The code list name to retrieve
   * @returns {CodeList[]} Array of CodeList items for the specified code
   */
  codeList(code: string): CodeList[] {
    if (!this.codelists.has(code)) {
      this.loggerService.error(`Code list ${code} not initialized`);
    }
    return this.codelists.get(code) || [];
  }

  /**
   * Gets the first item in a code list.
   *
   * @param {string} code - The code list name
   * @returns {CodeList} The first CodeList item or undefined if the list is empty
   */
  firstInCodeList(code: string): CodeList {
    return this.codeList(code)[0];
  }

  /**
   * Gets the default value from a code list (where defaultCode = true) or null.
   *
   * @param {string} code - The code list name
   * @returns {CodeList | null} The CodeList item with defaultCode = true, or null if not found
   */
  defaultValueOrNull(code: string): CodeList | null {
    const list = this.codeList(code);
    const defaultItem = list.find(c => c.defaultCode === true);
    return defaultItem || null;
  }

  /**
   * Finds a specific item in a code list by its value.
   *
   * @param {string} code - The code list name to search in
   * @param {string} value - The value to find in the code list
   * @returns {CodeList} The matching CodeList item or undefined if not found
   */
  findInCodeList(code: string, value: string): CodeList {
    return this.codeList(code).find((c) => c.value === value);
  }

  /**
   * Initializes multiple code lists by fetching their values from the service.
   * Stores the sorted results in the codelists map.
   *
   * @param {string[]} codeList - Array of code list names to initialize
   * @returns {Promise<void[]>} Promise that resolves when all code lists are initialized
   */
  async initCodeLists(codeList: string[]): Promise<void[]> {
    return Promise.all(
      codeList.map(async (code) => {
        const list: CodeList[] = await firstValueFrom(
          this.getCodeListValues(code)
        );
        this.codelists.set(
          code,
          [...list].sort((a, b) => a.description.localeCompare(b.description))
        );
      })
    );
  }

  /**
   * Fetches code list values from the service with appropriate parameters.
   *
   * @param {string} valueList - The name of the code list to fetch
   * @param {boolean} [notTraduction] - Optional flag to skip language parameter
   * @returns {Observable<CodeList[]>} Observable of CodeList array
   * @private
   */
  private getCodeListValues(valueList, notTraduction?) {
    const query: HalOptions = {
      params: [{ key: 'codeListName', value: valueList }],
    };
    if (!notTraduction) {
      let codelistLangValue = config.defaultLang;
      if (localStorage.lang) {
        codelistLangValue = localStorage.lang;
      }
      const param: HalParam = { key: 'lang', value: codelistLangValue };
      query.params.push(param);
    }

    return this.codeListService.getAll(query);
  }

  async canDeactivate(): Promise<boolean | Observable<boolean>> {
    return true;
  }

  setGridModifiedValue(value) {
    this.gridModified = value;
  }

  dataFetchFn: () => Observable<T[]> = () => { return EMPTY };
  dataUpdateFn: (data: T) => Promise<T> = (data) => Promise.resolve(data)
  dataDeleteFn: (data: T) => Promise<T> = (data) => Promise.resolve(data)

  sendChanges(data: T[]) {
    Promise.all(data.map((item) => this.dataUpdateFn(item))).then(() => {
      this.refreshCommandEvent$.next(true);
    })
  }

  abstract newData();

  duplicate(data: T[]) {
    if (data.length === 1) {
      this.duplicateItem(data[0].id);
    }
  }

  abstract duplicateItem(id: number);

  removeData(data: T[]) {
    if (data.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(DialogMessageComponent, {
      width: '400px',
      data: {
        title: 'common.delete.title',
        message: 'common.delete.message'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.event === DIALOG_EVENTS.ACCEPT) {
        // Wrap batch delete operation with loading overlay
        this.loadingOverlay.wrap(
          async () => {
            // Use allSettled instead of all to handle partial failures
            // This ensures refresh happens even if some deletions fail
            const results = await Promise.allSettled(
              data.map((item) => this.dataDeleteFn(item))
            );
            
            // Check for any failures and log them
            const failures = results.filter((result) => result.status === 'rejected');
            if (failures.length > 0) {
              // Log errors for failed deletions
              failures.forEach((failure, index) => {
                if (failure.status === 'rejected') {
                  this.loggerService.error(`Failed to delete item at index ${index}:`, failure.reason);
                  // Error handler will display user-friendly messages via interceptor
                }
              });
            }
            
            // Delay refresh if there were failures to ensure error messages are visible
            // Error messages are displayed via MatSnackBar with 4-10 second duration
            // We wait 2 seconds to allow error messages to appear before refreshing
            const refreshDelay = failures.length > 0 ? 2000 : 0;
            
            if (refreshDelay > 0) {
              await new Promise(resolve => setTimeout(resolve, refreshDelay));
            }
            
            // Always refresh the table to show current state (successful deletions removed, failed ones still visible)
            this.refreshCommandEvent$.next(true);
          },
          { message: this.translateService.instant('common.deleting') }
        );
      }
    });
  }
}
