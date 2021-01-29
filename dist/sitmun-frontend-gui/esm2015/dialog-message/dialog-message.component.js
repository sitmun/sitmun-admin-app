import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/dialog";
import * as i2 from "@angular/material/button";
import * as i3 from "@ngx-translate/core";
export class DialogMessageComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
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
/** @nocollapse */ DialogMessageComponent.ɵfac = function DialogMessageComponent_Factory(t) { return new (t || DialogMessageComponent)(i0.ɵɵdirectiveInject(i1.MatDialogRef)); };
/** @nocollapse */ DialogMessageComponent.ɵcmp = i0.ɵɵdefineComponent({ type: DialogMessageComponent, selectors: [["app-dialog-message"]], decls: 12, vars: 8, consts: [["mat-dialog-title", ""], [1, "mat-typography"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"]], template: function DialogMessageComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "h5", 0);
        i0.ɵɵtext(1);
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(2, "mat-dialog-content", 1);
        i0.ɵɵelementStart(3, "p");
        i0.ɵɵtext(4);
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(5, "mat-dialog-actions", 2);
        i0.ɵɵelementStart(6, "button", 3);
        i0.ɵɵlistener("click", function DialogMessageComponent_Template_button_click_6_listener() { return ctx.closeDialog(); });
        i0.ɵɵtext(7);
        i0.ɵɵpipe(8, "translate");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(9, "button", 4);
        i0.ɵɵlistener("click", function DialogMessageComponent_Template_button_click_9_listener() { return ctx.doAccept(); });
        i0.ɵɵtext(10);
        i0.ɵɵpipe(11, "translate");
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵtextInterpolate(ctx.title);
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate1(" ", ctx.message, " ");
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(8, 4, "cancel"));
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(11, 6, "accept"));
    } }, directives: [i1.MatDialogTitle, i1.MatDialogContent, i1.MatDialogActions, i2.MatButton], pipes: [i3.TranslatePipe], styles: [""] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DialogMessageComponent, [{
        type: Component,
        args: [{
                selector: 'app-dialog-message',
                templateUrl: './dialog-message.component.html',
                styleUrls: ['./dialog-message.component.css']
            }]
    }], function () { return [{ type: i1.MatDialogRef }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9tYWluL2FuZ3VsYXItbGlicmFyeS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtZ3VpL3NyYy9saWIvIiwic291cmNlcyI6WyJkaWFsb2ctbWVzc2FnZS9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQudHMiLCJkaWFsb2ctbWVzc2FnZS9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFPeEQsTUFBTSxPQUFPLHNCQUFzQjtJQUtqQyxZQUFvQixTQUErQztRQUEvQyxjQUFTLEdBQVQsU0FBUyxDQUFzQztJQUFHLENBQUM7SUFFdkUsUUFBUTtJQUNSLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7K0dBaEJVLHNCQUFzQjs4RUFBdEIsc0JBQXNCO1FDUm5DLDZCQUFxQjtRQUFBLFlBQVM7UUFBQSxpQkFBSztRQUNuQyw2Q0FDRTtRQUFBLHlCQUNFO1FBQUEsWUFDRjtRQUFBLGlCQUFJO1FBQ04saUJBQXFCO1FBQ3JCLDZDQUNFO1FBQUEsaUNBQTRDO1FBQXhCLG1HQUFTLGlCQUFhLElBQUM7UUFBQyxZQUF3Qjs7UUFBQSxpQkFBUztRQUM3RSxpQ0FBeUQ7UUFBckMsbUdBQVMsY0FBVSxJQUFDO1FBQWlCLGFBQXdCOztRQUFBLGlCQUFTO1FBQzVGLGlCQUFxQjs7UUFUQSxlQUFTO1FBQVQsK0JBQVM7UUFHMUIsZUFDRjtRQURFLDRDQUNGO1FBRzRDLGVBQXdCO1FBQXhCLG9EQUF3QjtRQUNYLGVBQXdCO1FBQXhCLHFEQUF3Qjs7a0REQXRFLHNCQUFzQjtjQUxsQyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsV0FBVyxFQUFFLGlDQUFpQztnQkFDOUMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7YUFDOUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGlhbG9nLW1lc3NhZ2UnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kaWFsb2ctbWVzc2FnZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlhbG9nLW1lc3NhZ2UuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dNZXNzYWdlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBtZXNzYWdlOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8RGlhbG9nTWVzc2FnZUNvbXBvbmVudD4peyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgZG9BY2NlcHQoKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQWNjZXB0J30pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VEaWFsb2coKXtcclxuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHtldmVudDonQ2FuY2VsJ30pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiPGg1IG1hdC1kaWFsb2ctdGl0bGU+e3t0aXRsZX19PC9oNT5cclxuPG1hdC1kaWFsb2ctY29udGVudCBjbGFzcz1cIm1hdC10eXBvZ3JhcGh5XCI+XHJcbiAgPHA+XHJcbiAgICB7e21lc3NhZ2V9fVxyXG4gIDwvcD5cclxuPC9tYXQtZGlhbG9nLWNvbnRlbnQ+XHJcbjxtYXQtZGlhbG9nLWFjdGlvbnMgYWxpZ249XCJlbmRcIj5cclxuICA8YnV0dG9uIG1hdC1idXR0b24gIChjbGljayk9XCJjbG9zZURpYWxvZygpXCI+e3tcImNhbmNlbFwiIHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cclxuICA8YnV0dG9uIG1hdC1idXR0b24gIChjbGljayk9XCJkb0FjY2VwdCgpXCIgY2RrRm9jdXNJbml0aWFsPnt7XCJhY2NlcHRcIiB8IHRyYW5zbGF0ZX19PC9idXR0b24+XHJcbjwvbWF0LWRpYWxvZy1hY3Rpb25zPiJdfQ==