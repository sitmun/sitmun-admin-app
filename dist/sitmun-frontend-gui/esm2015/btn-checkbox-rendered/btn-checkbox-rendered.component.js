/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
export class BtnCheckboxRenderedComponent {
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
        this.params = params;
        return true;
    }
    /**
     * @return {?}
     */
    invokeParentMethod() {
        this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    btnCheckedHandler(event) {
        /** @type {?} */
        let checked = !event.target.firstElementChild.checked;
        /** @type {?} */
        let colId = this.params.column.colId;
        this.params.value = checked;
        this.params.api.undoRedoService.isFilling = true;
        this.params.node.setDataValue(colId, checked);
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
BtnCheckboxRenderedComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-btn-checkbox-rendered',
                template: "<mat-checkbox (click)=\"btnCheckedHandler($event)\" [value]=\"params.value\" [checked]=\"params.value\"> </mat-checkbox>",
                styles: [""]
            }] }
];
if (false) {
    /** @type {?} */
    BtnCheckboxRenderedComponent.prototype.params;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiYnRuLWNoZWNrYm94LXJlbmRlcmVkL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFPckQsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7SUFJdkMsTUFBTSxDQUFDLE1BQVc7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEI7Ozs7O0lBRUQsT0FBTyxDQUFDLE1BQVc7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsT0FBTyxJQUFJLENBQUM7S0FDYjs7OztJQUVNLGtCQUFrQjtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQ2xELFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUMzRSxDQUFDOzs7Ozs7SUFHSixpQkFBaUIsQ0FBQyxLQUFLOztRQUNyQixJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDOztRQUN0RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsT0FBTyxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUMsSUFBSSxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FHL0M7Ozs7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7O0lBRUQsV0FBVzs7S0FFVjs7O1lBekNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxvSUFBcUQ7O2FBRXREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNlbGxSZW5kZXJlckFuZ3VsYXJDb21wIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtYnRuLWNoZWNrYm94LXJlbmRlcmVkJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQnRuQ2hlY2tib3hSZW5kZXJlZENvbXBvbmVudCBpbXBsZW1lbnRzIElDZWxsUmVuZGVyZXJBbmd1bGFyQ29tcCwgT25EZXN0cm95IHtcclxuXHJcbiAgcHVibGljIHBhcmFtczogYW55O1xyXG5cclxuICBhZ0luaXQocGFyYW1zOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gIH1cclxuXHJcbiAgcmVmcmVzaChwYXJhbXM6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICBcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGludm9rZVBhcmVudE1ldGhvZCgpIHtcclxuICAgIHRoaXMucGFyYW1zLmNvbnRleHQuY29tcG9uZW50UGFyZW50Lm1ldGhvZEZyb21QYXJlbnQoXHJcbiAgICAgIGBSb3c6ICR7dGhpcy5wYXJhbXMubm9kZS5yb3dJbmRleH0sIENvbDogJHt0aGlzLnBhcmFtcy5jb2xEZWYuaGVhZGVyTmFtZX1gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYnRuQ2hlY2tlZEhhbmRsZXIoZXZlbnQpIHtcclxuICAgIGxldCBjaGVja2VkID0gIWV2ZW50LnRhcmdldC5maXJzdEVsZW1lbnRDaGlsZC5jaGVja2VkO1xyXG4gICAgbGV0IGNvbElkID0gdGhpcy5wYXJhbXMuY29sdW1uLmNvbElkO1xyXG4gICAgdGhpcy5wYXJhbXMudmFsdWU9Y2hlY2tlZDtcclxuICAgIHRoaXMucGFyYW1zLmFwaS51bmRvUmVkb1NlcnZpY2UuaXNGaWxsaW5nPXRydWU7XHJcbiAgICB0aGlzLnBhcmFtcy5ub2RlLnNldERhdGFWYWx1ZShjb2xJZCwgY2hlY2tlZCk7XHJcblxyXG4gICAgXHJcbiAgfVxyXG5cclxuICBnZXRQYXJhbXMoKXtcclxuICAgIHJldHVybiB0aGlzLnBhcmFtcztcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgLy8gbm8gbmVlZCB0byByZW1vdmUgdGhlIGJ1dHRvbiBjbGljayBoYW5kbGVyIFxyXG4gIH1cclxuXHJcbn1cclxuIl19