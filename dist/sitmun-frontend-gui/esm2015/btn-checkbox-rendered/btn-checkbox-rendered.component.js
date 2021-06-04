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
        if (this.params.colDef.editable) {
            /** @type {?} */
            let checked = !event.target.firstElementChild.checked;
            /** @type {?} */
            let colId = this.params.column.colId;
            this.params.value = checked;
            this.params.api.undoRedoService.isFilling = true;
            this.params.node.setDataValue(colId, checked);
        }
        else {
            event.preventDefault();
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiYnRuLWNoZWNrYm94LXJlbmRlcmVkL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFPckQsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7SUFJdkMsTUFBTSxDQUFDLE1BQVc7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7S0FDdEI7Ozs7O0lBRUQsT0FBTyxDQUFDLE1BQVc7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsT0FBTyxJQUFJLENBQUM7S0FDYjs7OztJQUVNLGtCQUFrQjtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQ2xELFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUMzRSxDQUFDOzs7Ozs7SUFHSixpQkFBaUIsQ0FBQyxLQUFLO1FBQ3JCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDOztZQUM3QixJQUFJLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDOztZQUN0RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsT0FBTyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUMsSUFBSSxDQUFDO1lBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDL0M7YUFDRztZQUNGLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN4QjtLQUdGOzs7O0lBRUQsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjs7OztJQUVELFdBQVc7O0tBRVY7OztZQTlDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsb0lBQXFEOzthQUV0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDZWxsUmVuZGVyZXJBbmd1bGFyQ29tcCB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWJ0bi1jaGVja2JveC1yZW5kZXJlZCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEJ0bkNoZWNrYm94UmVuZGVyZWRDb21wb25lbnQgaW1wbGVtZW50cyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAsIE9uRGVzdHJveSB7XHJcblxyXG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcclxuXHJcbiAgYWdJbml0KHBhcmFtczogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICB9XHJcblxyXG4gIHJlZnJlc2gocGFyYW1zOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbnZva2VQYXJlbnRNZXRob2QoKSB7XHJcbiAgICB0aGlzLnBhcmFtcy5jb250ZXh0LmNvbXBvbmVudFBhcmVudC5tZXRob2RGcm9tUGFyZW50KFxyXG4gICAgICBgUm93OiAke3RoaXMucGFyYW1zLm5vZGUucm93SW5kZXh9LCBDb2w6ICR7dGhpcy5wYXJhbXMuY29sRGVmLmhlYWRlck5hbWV9YFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGJ0bkNoZWNrZWRIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBpZih0aGlzLnBhcmFtcy5jb2xEZWYuZWRpdGFibGUpe1xyXG4gICAgICBsZXQgY2hlY2tlZCA9ICFldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQuY2hlY2tlZDtcclxuICAgICAgbGV0IGNvbElkID0gdGhpcy5wYXJhbXMuY29sdW1uLmNvbElkO1xyXG4gICAgICB0aGlzLnBhcmFtcy52YWx1ZT1jaGVja2VkO1xyXG4gICAgICB0aGlzLnBhcmFtcy5hcGkudW5kb1JlZG9TZXJ2aWNlLmlzRmlsbGluZz10cnVlO1xyXG4gICAgICB0aGlzLnBhcmFtcy5ub2RlLnNldERhdGFWYWx1ZShjb2xJZCwgY2hlY2tlZCk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZ2V0UGFyYW1zKCl7XHJcbiAgICByZXR1cm4gdGhpcy5wYXJhbXM7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIC8vIG5vIG5lZWQgdG8gcmVtb3ZlIHRoZSBidXR0b24gY2xpY2sgaGFuZGxlciBcclxuICB9XHJcblxyXG59XHJcbiJdfQ==