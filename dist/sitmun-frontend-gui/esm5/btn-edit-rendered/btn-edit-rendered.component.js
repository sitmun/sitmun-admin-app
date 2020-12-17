/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
var BtnEditRenderedComponent = /** @class */ (function () {
    function BtnEditRenderedComponent() {
    }
    /**
     * @param {?} params
     * @return {?}
     */
    BtnEditRenderedComponent.prototype.agInit = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        this.params = params;
    };
    /**
     * @param {?} params
     * @return {?}
     */
    BtnEditRenderedComponent.prototype.refresh = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        return true;
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    BtnEditRenderedComponent.prototype.btnClickedHandler = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        this.params.clicked(this.params.value);
    };
    /**
     * @return {?}
     */
    BtnEditRenderedComponent.prototype.getParams = /**
     * @return {?}
     */
    function () {
        return this.params;
    };
    /**
     * @return {?}
     */
    BtnEditRenderedComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        // no need to remove the button click handler
    };
    BtnEditRenderedComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-btn-edit-rendered',
                    template: "<button mat-mini-fab class=\"buttonEdit\"  type=\"button\"  (click)=\"btnClickedHandler($event)\" >\n  <mat-icon class=\"iconEdit\"   fontSet=\"material-icons-round\" > edit </mat-icon>\n</button> ",
                    styles: [".buttonEdit{color:#000;background-color:#ddd;width:20px;margin-top:3px;height:20px;box-shadow:none}.iconEdit{font-size:13px;margin-top:-10px;margin-left:-2px}"]
                },] },
    ];
    return BtnEditRenderedComponent;
}());
export { BtnEditRenderedComponent };
if (false) {
    /** @type {?} */
    BtnEditRenderedComponent.prototype.params;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWVkaXQtcmVuZGVyZWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNpdG11bi9mcm9udGVuZC1ndWkvIiwic291cmNlcyI6WyJidG4tZWRpdC1yZW5kZXJlZC9idG4tZWRpdC1yZW5kZXJlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7O0lBYW5ELHlDQUFNOzs7O0lBQU4sVUFBTyxNQUFXO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3RCOzs7OztJQUVELDBDQUFPOzs7O0lBQVAsVUFBUSxNQUFXO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDYjs7Ozs7SUFFRCxvREFBaUI7Ozs7SUFBakIsVUFBa0IsTUFBTTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hDOzs7O0lBRUQsNENBQVM7OztJQUFUO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7Ozs7SUFFRCw4Q0FBVzs7O0lBQVg7O0tBRUM7O2dCQTdCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsUUFBUSxFQUFFLHVNQUVEO29CQUNULE1BQU0sRUFBRSxDQUFDLGdLQUFnSyxDQUFDO2lCQUMzSzs7bUNBVEQ7O1NBVWEsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNlbGxSZW5kZXJlckFuZ3VsYXJDb21wIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtYnRuLWVkaXQtcmVuZGVyZWQnLFxyXG4gIHRlbXBsYXRlOiBgPGJ1dHRvbiBtYXQtbWluaS1mYWIgY2xhc3M9XCJidXR0b25FZGl0XCIgIHR5cGU9XCJidXR0b25cIiAgKGNsaWNrKT1cImJ0bkNsaWNrZWRIYW5kbGVyKCRldmVudClcIiA+XHJcbiAgPG1hdC1pY29uIGNsYXNzPVwiaWNvbkVkaXRcIiAgIGZvbnRTZXQ9XCJtYXRlcmlhbC1pY29ucy1yb3VuZFwiID4gZWRpdCA8L21hdC1pY29uPlxyXG48L2J1dHRvbj4gYCxcclxuICBzdHlsZXM6IFtgLmJ1dHRvbkVkaXR7Y29sb3I6IzAwMDtiYWNrZ3JvdW5kLWNvbG9yOiNkZGQ7d2lkdGg6MjBweDttYXJnaW4tdG9wOjNweDtoZWlnaHQ6MjBweDtib3gtc2hhZG93Om5vbmV9Lmljb25FZGl0e2ZvbnQtc2l6ZToxM3B4O21hcmdpbi10b3A6LTEwcHg7bWFyZ2luLWxlZnQ6LTJweH1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQnRuRWRpdFJlbmRlcmVkQ29tcG9uZW50IGltcGxlbWVudHMgSUNlbGxSZW5kZXJlckFuZ3VsYXJDb21wLCBPbkRlc3Ryb3kge1xyXG5cclxuICBwdWJsaWMgcGFyYW1zOiBhbnk7XHJcblxyXG4gIGFnSW5pdChwYXJhbXM6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoKHBhcmFtczogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGJ0bkNsaWNrZWRIYW5kbGVyKCRldmVudCkge1xyXG4gICAgdGhpcy5wYXJhbXMuY2xpY2tlZCh0aGlzLnBhcmFtcy52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRQYXJhbXMoKXtcclxuICAgIHJldHVybiB0aGlzLnBhcmFtcztcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgLy8gbm8gbmVlZCB0byByZW1vdmUgdGhlIGJ1dHRvbiBjbGljayBoYW5kbGVyIFxyXG4gIH1cclxuXHJcbn1cclxuIl19