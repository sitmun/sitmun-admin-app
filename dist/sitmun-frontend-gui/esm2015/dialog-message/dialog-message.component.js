import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
export class DialogMessageComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
        this.hideCancelButton = false;
    }
    ngOnInit() {
    }
    doAccept() {
        this.dialogRef.close({ event: 'Accept' });
    }
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
DialogMessageComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-dialog-message',
                template: "<h5 mat-dialog-title class=\"titleDialog\">{{title}}</h5>\r\n<mat-dialog-content class=\"mat-typography\">\r\n  <p>\r\n    {{message}}\r\n  </p>\r\n</mat-dialog-content>\r\n<mat-dialog-actions align=\"end\">\r\n  <button mat-flat-button class=\"returnButton\"  *ngIf=\"!hideCancelButton\" (click)=\"closeDialog()\">{{\"cancel\" | translate}}</button>\r\n  <button mat-flat-button class=\"saveButton\"  (click)=\"doAccept()\" cdkFocusInitial>{{\"accept\" | translate}}</button>\r\n</mat-dialog-actions>",
                styles: [".titleDialog{margin-top:inherit!important;margin-bottom:15px!important}"]
            },] }
];
/** @nocollapse */
DialogMessageComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi9kaWFsb2ctbWVzc2FnZS9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFPeEQsTUFBTSxPQUFPLHNCQUFzQjtJQU1qQyxZQUFvQixTQUErQztRQUEvQyxjQUFTLEdBQVQsU0FBUyxDQUFzQztRQUZuRSxxQkFBZ0IsR0FBVyxLQUFLLENBQUM7SUFFcUMsQ0FBQztJQUV2RSxRQUFRO0lBQ1IsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDOzs7WUF0QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLGlnQkFBOEM7O2FBRS9DOzs7O1lBTlEsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1kaWFsb2ctbWVzc2FnZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpYWxvZy1tZXNzYWdlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dNZXNzYWdlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgaGlkZUNhbmNlbEJ1dHRvbiA6IGJvb2xlYW49ZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8RGlhbG9nTWVzc2FnZUNvbXBvbmVudD4peyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgZG9BY2NlcHQoKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWNjZXB0J30pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19