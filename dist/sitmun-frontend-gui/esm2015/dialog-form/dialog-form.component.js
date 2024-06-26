import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogMessageComponent } from '../dialog-message/dialog-message.component';
export class DialogFormComponent {
    constructor(dialogRef, dialog, translate) {
        this.dialogRef = dialogRef;
        this.dialog = dialog;
        this.translate = translate;
    }
    ngOnInit() {
    }
    doAdd() {
        if (this.form.valid) {
            this.dialogRef.close({ event: 'Add' });
        }
        else {
            const dialogRef = this.dialog.open(DialogMessageComponent);
            dialogRef.componentInstance.title = this.translate.instant("atention");
            dialogRef.componentInstance.message = this.translate.instant("requiredFieldMessage");
            dialogRef.componentInstance.hideCancelButton = true;
            dialogRef.afterClosed().subscribe();
        }
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogFormComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-dialog-form',
                template: "<h5 mat-dialog-title>{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <ng-container *ngTemplateOutlet=\"HTMLReceived\">\r\n  </ng-container> \r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAdd()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                styles: [""]
            },] }
];
/** @nocollapse */
DialogFormComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: MatDialog },
    { type: TranslateService }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWZvcm0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi9kaWFsb2ctZm9ybS9kaWFsb2ctZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBOEMsTUFBTSxlQUFlLENBQUM7QUFFdEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQU9wRixNQUFNLE9BQU8sbUJBQW1CO0lBSzlCLFlBQ1UsU0FBNEMsRUFDN0MsTUFBaUIsRUFDaEIsU0FBMkI7UUFGM0IsY0FBUyxHQUFULFNBQVMsQ0FBbUM7UUFDN0MsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtJQUFHLENBQUM7SUFFekMsUUFBUTtJQUVSLENBQUM7SUFHRCxLQUFLO1FBQ0gsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUM7U0FBRTthQUN2RDtZQUNGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDM0QsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUN0RSxTQUFTLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUE7WUFDcEYsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUNwRCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDdEM7SUFFSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7O1lBbENGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixtZkFBMkM7O2FBRTVDOzs7O1lBUm1CLFlBQVk7WUFBdkIsU0FBUztZQUNULGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Hcm91cCxGb3JtQ29udHJvbCxWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7IFxyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IERpYWxvZ01lc3NhZ2VDb21wb25lbnQgfSBmcm9tICcuLi9kaWFsb2ctbWVzc2FnZS9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGlhbG9nLWZvcm0nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kaWFsb2ctZm9ybS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlhbG9nLWZvcm0uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGlhbG9nRm9ybUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGZvcm06IEZvcm1Hcm91cDtcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIEhUTUxSZWNlaXZlZDtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8RGlhbG9nRm9ybUNvbXBvbmVudD4sXHJcbiAgICBwdWJsaWMgZGlhbG9nOiBNYXREaWFsb2csXHJcbiAgICBwcml2YXRlIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZSkge31cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIGRvQWRkKCl7XHJcbiAgICBpZih0aGlzLmZvcm0udmFsaWQpIHsgdGhpcy5kaWFsb2dSZWYuY2xvc2Uoe2V2ZW50OidBZGQnfSk7IH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihEaWFsb2dNZXNzYWdlQ29tcG9uZW50KTtcclxuICAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS50aXRsZSA9IHRoaXMudHJhbnNsYXRlLmluc3RhbnQoXCJhdGVudGlvblwiKVxyXG4gICAgICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLm1lc3NhZ2UgPSB0aGlzLnRyYW5zbGF0ZS5pbnN0YW50KFwicmVxdWlyZWRGaWVsZE1lc3NhZ2VcIilcclxuICAgICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5oaWRlQ2FuY2VsQnV0dG9uID0gdHJ1ZTtcclxuICAgICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGNsb3NlRGlhbG9nKCl7XHJcbiAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSh7ZXZlbnQ6J0NhbmNlbCd9KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==