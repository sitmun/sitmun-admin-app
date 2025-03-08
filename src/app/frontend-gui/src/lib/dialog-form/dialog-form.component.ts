import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styles: []
})
export class DialogFormComponent implements OnInit {

  form: UntypedFormGroup;
  title: string;
  HTMLReceived;
  constructor(
    private dialogRef: MatDialogRef<DialogFormComponent>,
    public dialog: MatDialog,
    private translate: TranslateService) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method,@typescript-eslint/no-empty-function
  ngOnInit(): void {

  }


  doAdd(){
    if(this.form.valid) { this.dialogRef.close({event:'Add'}); }
    else {
       const dialogRef = this.dialog.open(DialogMessageComponent);
       dialogRef.componentInstance.title = this.translate.instant("atention")
       dialogRef.componentInstance.message = this.translate.instant("requiredFieldMessage")
       dialogRef.componentInstance.hideCancelButton = true;
       dialogRef.afterClosed().subscribe();
    }

  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
