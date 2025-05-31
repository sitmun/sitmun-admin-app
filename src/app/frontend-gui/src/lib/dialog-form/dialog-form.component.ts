import { Component, OnInit, TemplateRef, inject} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/dialog-message/dialog-message.component';
import { explainFormValidity } from '@app/utils/form.utils';

export const DIALOG_FORM_EVENTS = {
  ADD: { event: 'Add' } as DialogFormResult,
  CANCEL: { event: 'Cancel' } as DialogFormResult
} as const;

export interface DialogFormData {
  form: UntypedFormGroup;
  title: string;
  HTMLReceived: TemplateRef<any>;
}

export interface DialogFormResult {
  event: 'Add' | 'Cancel';
}
@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styles: []
})
export class DialogFormComponent implements OnInit {
  readonly data = inject<DialogFormData>(MAT_DIALOG_DATA);

  form: UntypedFormGroup;
  title: string;
  HTMLReceived: TemplateRef<any>;

  constructor(
    private dialogRef: MatDialogRef<DialogFormComponent, DialogFormResult>,
    public dialog: MatDialog,
    private translate: TranslateService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method,@typescript-eslint/no-empty-function
  ngOnInit(): void {
    if (this.data) {
      Object.assign(this, this.data);
    }
  }

  doAdd(){
    console.log(explainFormValidity(this.form))
    if(this.form.valid) {
      this.dialogRef.close(DIALOG_FORM_EVENTS.ADD);
    } else {
       const dialogRef = this.dialog.open(DialogMessageComponent);
       dialogRef.componentInstance.title = this.translate.instant("atention")
       dialogRef.componentInstance.message = this.translate.instant("requiredFieldMessage")
       dialogRef.componentInstance.hideCancelButton = true;
    }
  }

  closeDialog(){
    this.dialogRef.close(DIALOG_FORM_EVENTS.CANCEL);
  }

}
