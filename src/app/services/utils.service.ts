import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { HalOptions, HalParam, CodeListService, Translation,  TranslationService } from '../frontend-core/src/lib/public_api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogMessageComponent, DialogTranslationComponent } from '../frontend-gui/src/lib/public_api';
import { MatDialog } from '@angular/material/dialog';
import { config } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  [x: string]: any;

  private subjectLoading: Subject<boolean> = new Subject();

  constructor(private translate: TranslateService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private location: Location,
    private translationService: TranslationService,
    private codeListService: CodeListService) { }


  showMessage(message) {
    this.snackBar.open(this.translate.instant(message), '', {
      duration: 5000
    });

  }

  getTranslate(msg) {
    return this.translate.instant(msg);
  }

  showErrorMessage(error) {
    let missatge = "";
    try {
      if (error.error && error.error.errors) {

        error.error.errors.forEach(element => {
          missatge += this.translate.instant("Property: " + element.property + " " + element.message + ";")
        });

      } else {
        missatge = this.translate.instant(error.error ? (error.error.error + ': ' + error.error.message) : error.message)
      }
    }
    catch (e) {
      missatge = error.toString();
    }

    this.snackBar.open(missatge, '', {
      duration: 5000,
      panelClass: ['error-snackbar']
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
    let params2: HalParam[] = [];
    let codelistLangValue = config.defaultLang;
    if(localStorage.lang) { codelistLangValue=localStorage.lang }
    let param: HalParam = { key: 'codeListName', value: valueList }
    params2.push(param);
    if(!notTraduction){
      let param2: HalParam = { key: 'lang', value: codelistLangValue }
      params2.push(param2);
    }
    let query: HalOptions = { params: params2 };

    return this.codeListService.getAll(query);
  }


  getDateFormated(data) {
    return data.value ? (new Date(data.value)).toLocaleDateString() : ''
  }

  duplicateParameter(data, parameterToModify, ignoreId?, ignoreLinks?){
    let elementsToDuplicate = []
    data.forEach(element => {
      let newElement = { ...element };
      newElement[parameterToModify] = this.getTranslate('copy_').concat(newElement[parameterToModify]);
      if(!ignoreId){
        newElement.id = null;
      }
      if(!ignoreLinks){
        newElement._links = null;
      }
      elementsToDuplicate.push(newElement);
    });

    return elementsToDuplicate;
  }


  getDateFilterParams() {
    var filterParams = {
      comparator: function (filterLocalDateAtMidnight, cellValue) {
        var dateAsString = cellValue;
        if (dateAsString == null) return -1;
        var cellDate = new Date(cellValue);
        if (filterLocalDateAtMidnight.toLocaleDateString() === cellDate.toLocaleDateString()) {
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

    return filterParams;
  }


  //Update grids

  updateUriList(requestURI: string, data: any[], eventRefresh?) {

    this.http
      .put(requestURI
        , this.createUriList(data), { headers: new HttpHeaders({ 'Content-Type': 'text/uri-list', 'Charset': 'UTF-8' }) }).subscribe(
          result => {
            this.success = true
            if (eventRefresh) { eventRefresh.next(true); }
          },
          error => { this.success = false }
        )

  }

  createUriList(data: any[]) {
    let putRequestLine = '';
    data.forEach(item => {
      putRequestLine += `${item}` + '\n';
    });
    console.log(putRequestLine);
    return putRequestLine;
  }

  showRequiredFieldsError() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate("atention");
    dialogRef.componentInstance.message = this.getTranslate("requiredFieldMessage")
    dialogRef.componentInstance.hideCancelButton = true;
    dialogRef.afterClosed().subscribe();
  }

  showNavigationOutDialog() {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.getTranslate('caution')
    dialogRef.componentInstance.message = this.getTranslate('navigateOutMessage')
    return dialogRef.afterClosed();
  }

  getSelCheckboxColumnDef() {
    let columnDef =
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      editable: false,
      filter: false,
      minWidth: 45,
      maxWidth: 45,
      lockPosition: true
    }

    return columnDef;
  }

  getEditBtnColumnDef() {
    let columnDef =
    {
      headerName: '',
      field: 'id',
      editable: false,
      filter: false,
      minWidth: 50,
      maxWidth: 50,
      lockPosition: true,
      cellRenderer: 'btnEditRendererComponent',
    }
    return columnDef;
  }

  getIdColumnDef(customId?) {
    let columnDef =
    {
      headerName: 'Id',
      field: customId ? customId : 'id',
      editable: false,
      minWidth: 80,
    }

    return columnDef;
  }

  getStatusColumnDef() {
    let columnDef =
    {
      headerName: this.getTranslate('status'),
      field: 'status',
      filter: 'agTextColumnFilter',
      filterParams: { textFormatter: (filterValue) => this.getTranslate(filterValue).toLowerCase() },
      editable: false,
      valueFormatter: (params) => {
        if (params.value != undefined && params.value !== '') {
          return this.getTranslate(params.value)
        }else{
          return this.getTranslate('statusOK')
        }
      },
      cellClassRules: {
        'pendingModify': function (params) { return params.value === 'pendingModify' },
        'pendingDelete': function (params) { return params.value === 'pendingDelete' },
        'pendingCreation': function (params) { return params.value === 'pendingCreation' },
        'notAvailable': function (params) { return params.value === 'notAvailable' },
        'pendingRegistration': function (params) { return params.value === 'pendingRegistration' },
        'unregisteredLayer': function (params) { return params.value === 'unregisteredLayer' },
        'stable': function (params) { return params.value === undefined || params.value === 'statusOK'}
      }
    }
    return columnDef;
  }

  getDateColumnDef(alias, field,editable?:boolean) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
      filter: 'agDateColumnFilter',
      filterParams: this.getDateFilterParams(),
      editable: editable?editable:false,
      cellRenderer: (data) => {
        return this.getDateFormated(data)
      },
      cellEditor:'datePicker',
      minWidth: 140,
    }

    return columnDef;
  }

  getSelectColumnDef(alias, field,editable, elements, formatted?, formattedList?) {

    let columnDef;
    
    if(formatted && formattedList){
      columnDef= this.getFormattedColumnDef(alias,formattedList,field)
      columnDef.filter='agTextColumnFilter';
      columnDef.editable = editable;
      columnDef.field = field;
      columnDef.cellEditorParams = {
        values: elements
      };
      columnDef.cellEditor ='agSelectCellEditor';
      columnDef.minWidth = 140;
    }
    else{
      columnDef =
      {
        headerName: this.getTranslate(alias),
        field: field,
        filter: 'agTextColumnFilter',
        editable: editable,
        cellEditorParams: {
          values: elements,
      },
        cellEditor:'agSelectCellEditor',
        minWidth: 140,
      }
  
    }

    console.log(columnDef)

   
    return columnDef;
  }

  getEditableColumnDef(alias, field) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
      editable: true,
    }

    return columnDef;
  }

  getNonEditableColumnDef(alias, field) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,

    }

    return columnDef;
  }

  getBooleanColumnDef(alias, field, editable) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
      editable: editable,
      singleSelection: true,
      cellRenderer: 'btnCheckboxRendererComponent',
      floatingFilterComponent: 'btnCheckboxFilterComponent',
      floatingFilterComponentParams: { suppressFilterButton: true },
      minWidth: 110,
    }

    return columnDef;
  }

  getFormattedColumnDef(alias, filterList, field, fieldToCompare?, fieldToShow?) {
    let fieldReturned= fieldToShow? fieldToShow: 'description'
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      editable: false,
      valueGetter: (params) => {
        
        var alias = fieldToCompare
        ?filterList.filter((format) => format[fieldToCompare] == params.data[field])[0]
        :filterList.filter((format) => format.value == params.data[field])[0];
        return alias != undefined ? alias[fieldReturned] : params.data[field]
      }
    }
    return columnDef;
  }

  //Translation

  createTranslationsList(columnName:string): Map<string, Translation> {
    let translationsList: Map<string, Translation> = new Map<string, Translation>();

    let languagesToUse = config.languagesToUse?config.languagesToUse:JSON.parse(localStorage.getItem('languages'));
    if(languagesToUse){
      languagesToUse.forEach(language => {
        let currentTranslation: Translation = new Translation();
        currentTranslation.translation = null;
        currentTranslation.column = columnName;
        currentTranslation.language = language;
        translationsList.set(language.shortname, currentTranslation);
      });
    }
    return translationsList;
  }

  async openTranslationDialog(translationsMap: Map<string, Translation>){
    const dialogRef = this.dialog.open(DialogTranslationComponent, { panelClass: 'translateDialogs' });
    dialogRef.componentInstance.translationsMap=translationsMap;
    dialogRef.componentInstance.languageByDefault=config.defaultLang;
    dialogRef.componentInstance.languagesAvailables=config.languagesToUse;

    let result = null;
    result= await dialogRef.afterClosed().toPromise();
    if(result) { return result }
    else { return null } 

  }

  updateTranslations(translationsMap: Map<string,Translation>, translations:Array<Translation> ){
    translations.forEach(translation => {
      translationsMap.set(translation.languageShortname,translation) 
    });
    return translationsMap;
  }

  async saveTranslation(id, translationMap: Map<string, Translation>, internationalValue, modifications: boolean){
    let defaultLanguage = config.defaultLang;
    const promises: Promise<any>[] = [];
    if(translationMap){
      translationMap.forEach(async (value: Translation, key: string) => {
        if(key == defaultLanguage && internationalValue) {
            value.element = id;
            value.translation = internationalValue;
            promises.push(new Promise((resolve, reject) => {
              this.translationService.save(value).subscribe(result => {
                 translationMap.set(key,result)
                 resolve(true) 
                })
            }));
        }
        else if(modifications){
          if(value && value.translation) {
             value.element = id 
             promises.push(new Promise((resolve, reject) => {
              this.translationService.save(value).subscribe(result => {
                translationMap.set(key,result)
                resolve(true) 
                })
            }));
            }
        }
      });
    }

    Promise.all(promises).then(() => {
      return translationMap;
    });

  }


}
