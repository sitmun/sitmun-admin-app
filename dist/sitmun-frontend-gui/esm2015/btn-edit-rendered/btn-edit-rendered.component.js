/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
export class BtnEditRenderedComponent {
    /**
     * @param {?} params
     * @return {?}
     */
    agInit(params) {
        this.params = params;
    }
    /**
     * @param {?} params
     * @return {?}
     */
    refresh(params) {
        return true;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    btnClickedHandler($event) {
        this.params.clicked(this.params.value);
    }
    /**
     * @return {?}
     */
    getParams() {
        return this.params;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        // no need to remove the button click handler
    }
}
BtnEditRenderedComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-btn-edit-rendered',
                template: `<button mat-mini-fab class="buttonEdit"  type="button"  (click)="btnClickedHandler($event)" >
  <mat-icon class="iconEdit"   fontSet="material-icons-round" > edit </mat-icon>
</button> `,
                styles: [`.buttonEdit{color:#000;background-color:#ddd;width:24px;height:24px}.iconEdit{font-size:16px;margin-top:-8px}`]
            },] },
];
if (false) {
    /** @type {?} */
    BtnEditRenderedComponent.prototype.params;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1ndWkvIiwic291cmNlcyI6WyJidG4tZWRpdC1yZW5kZXJlZC9idG4tZWRpdC1yZW5kZXJlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFTckQsTUFBTTs7Ozs7SUFJSixNQUFNLENBQUMsTUFBVztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUN0Qjs7Ozs7SUFFRCxPQUFPLENBQUMsTUFBVztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ2I7Ozs7O0lBRUQsaUJBQWlCLENBQUMsTUFBTTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hDOzs7O0lBRUQsU0FBUztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7O0lBRUQsV0FBVzs7S0FFVjs7O1lBN0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUU7O1dBRUQ7Z0JBQ1QsTUFBTSxFQUFFLENBQUMsK0dBQStHLENBQUM7YUFDMUgiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XG5pbXBvcnQgeyBDb21wb25lbnQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtYnRuLWVkaXQtcmVuZGVyZWQnLFxuICB0ZW1wbGF0ZTogYDxidXR0b24gbWF0LW1pbmktZmFiIGNsYXNzPVwiYnV0dG9uRWRpdFwiICB0eXBlPVwiYnV0dG9uXCIgIChjbGljayk9XCJidG5DbGlja2VkSGFuZGxlcigkZXZlbnQpXCIgPlxuICA8bWF0LWljb24gY2xhc3M9XCJpY29uRWRpdFwiICAgZm9udFNldD1cIm1hdGVyaWFsLWljb25zLXJvdW5kXCIgPiBlZGl0IDwvbWF0LWljb24+XG48L2J1dHRvbj4gYCxcbiAgc3R5bGVzOiBbYC5idXR0b25FZGl0e2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjojZGRkO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHh9Lmljb25FZGl0e2ZvbnQtc2l6ZToxNnB4O21hcmdpbi10b3A6LThweH1gXVxufSlcbmV4cG9ydCBjbGFzcyBCdG5FZGl0UmVuZGVyZWRDb21wb25lbnQgaW1wbGVtZW50cyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIHBhcmFtczogYW55O1xuXG4gIGFnSW5pdChwYXJhbXM6IGFueSk6IHZvaWQge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICB9XG5cbiAgcmVmcmVzaChwYXJhbXM6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYnRuQ2xpY2tlZEhhbmRsZXIoJGV2ZW50KSB7XG4gICAgdGhpcy5wYXJhbXMuY2xpY2tlZCh0aGlzLnBhcmFtcy52YWx1ZSk7XG4gIH1cblxuICBnZXRQYXJhbXMoKXtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXM7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBubyBuZWVkIHRvIHJlbW92ZSB0aGUgYnV0dG9uIGNsaWNrIGhhbmRsZXIgXG4gIH1cblxufVxuIl19