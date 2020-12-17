import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  [x: string]: any;

  private subjectLoading: Subject<boolean> = new Subject();

  constructor(private translate: TranslateService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location) { }


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
      missatge = this.translate.instant(error.error ? (error.error.error + '. ' + error.error.message) : error.message)
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

}
