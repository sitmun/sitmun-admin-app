import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { HalOptions, HalParam, CodeListService } from 'dist/sitmun-frontend-core/';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  [x: string]: any;

  private subjectLoading: Subject<boolean> = new Subject();

  constructor(private translate: TranslateService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location,
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

  getCodeListValues(valueList) {
    let params2: HalParam[] = [];
    let param: HalParam = { key: 'codeListName', value: valueList }
    params2.push(param);
    let query: HalOptions = { params: params2 };

    return this.codeListService.getAll(query);
  }


  getDateFormated(data) {
    return data.value ? (new Date(data.value)).toLocaleDateString() : ''
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

  getSelCheckboxColumnDef() {
    let columnDef =
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
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
      valueFormatter: (params) => {
        if (params.value != undefined) {
          return this.getTranslate(params.value)
        }
      }
    }
    return columnDef;
  }

  getDateColumnDef(alias, field) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
      filter: 'agDateColumnFilter',
      filterParams: this.getDateFilterParams(),
      editable: false,
      cellRenderer: (data) => {
        return this.getDateFormated(data)
      },
      minWidth: 140,
    }

    return columnDef;
  }

  getEditableColumnDef(alias, field) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
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

  getBooleanColumnDef(alias, field) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      field: field,
      editable: false,
      cellRenderer: 'btnCheckboxRendererComponent',
      floatingFilterComponent: 'btnCheckboxFilterComponent',
      floatingFilterComponentParams: { suppressFilterButton: true },
      minWidth: 110,
    }

    return columnDef;
  }

  getFormattedColumnDef(alias, filterList, field) {
    let columnDef =
    {
      headerName: this.getTranslate(alias),
      editable: false,
      valueGetter: (params) => {
        var alias = filterList.filter((format) => format.value == params.data[field])[0];
        return alias != undefined ? alias.description : params.data[field]
      }
    }
    return columnDef;
  }
}
