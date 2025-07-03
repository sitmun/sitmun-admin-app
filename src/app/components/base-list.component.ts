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
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.fetchData()
      .then(() => this.afterFetch())
      .catch((reason) =>
        this.errorHandler.handleError('Error in ngOnInit:', reason)
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
        Promise.all(data.map((item) => this.dataDeleteFn(item))).then(() => {
          this.refreshCommandEvent$.next(true);
        });
      }
    });
  }
}
