/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
export class BtnCheckboxFilterComponent {
    constructor() {
        this.text = '';
    }
    /**
     * @param {?} params
     * @return {?}
     */
    agInit(params) {
        this.params = params;
        this.valueGetter = params.filterParams.valueGetter;
        this.params.suppressFilterButton = true;
    }
    /**
     * @return {?}
     */
    isFilterActive() {
        return this.text != null && this.text !== '';
    }
    /**
     * @param {?} params
     * @return {?}
     */
    doesFilterPass(params) {
        return this.text
            .toLowerCase()
            .split(' ')
            .every((filterWord) => this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0);
    }
    /**
     * @return {?}
     */
    getModel() {
        return { value: this.text };
    }
    /**
     * @param {?} model
     * @return {?}
     */
    setModel(model) {
        this.text = model ? model.value : '';
    }
    /**
     * @param {?} newValue
     * @return {?}
     */
    onChange(newValue) {
        this.params.parentFilterInstance(function (instance) {
            instance.onFloatingFilterChanged('contains', newValue);
        });
    }
    /**
     * @param {?} parentModel
     * @return {?}
     */
    onParentModelChanged(parentModel) {
        if (!parentModel) {
            this.currentValue = 0;
        }
        else {
            // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
            // so just read off the value and use that
            this.currentValue = parentModel.filter;
        }
    }
}
BtnCheckboxFilterComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-btn-checkbox-filter',
                template: "<select  #filterSelect  (change)='onChange(filterSelect.value)'>\r\n    <option value=\"\">{{\"selectAll\" | translate}}</option>\r\n    <option value=\"true\">{{\"enabled\" | translate}}</option>\r\n    <option value=\"false\">{{\"disabled\" | translate}}</option>\r\n  </select>",
                host: { 'class': 'hostClass' },
                styles: [".hostClass{width:100%}"]
            }] }
];
BtnCheckboxFilterComponent.propDecorators = {
    input: [{ type: ViewChild, args: ['input', { read: ViewContainerRef },] }]
};
if (false) {
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.params;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.valueGetter;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.text;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.currentValue;
    /** @type {?} */
    BtnCheckboxFilterComponent.prototype.input;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi8iLCJzb3VyY2VzIjpbImJ0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBcUJ2RSxNQUFNLE9BQU8sMEJBQTBCOztvQkFHZixFQUFFOzs7Ozs7SUFJeEIsTUFBTSxDQUFDLE1BQTZCO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBQyxJQUFJLENBQUM7S0FDdkM7Ozs7SUFFRCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQztLQUM5Qzs7Ozs7SUFFRCxjQUFjLENBQUMsTUFBNkI7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLFdBQVcsRUFBRTthQUNiLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixLQUFLLENBQ0osQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUMxQixRQUFRLEVBQUU7YUFDVixXQUFXLEVBQUU7YUFDYixPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUM5QixDQUFDO0tBQ0w7Ozs7SUFFRCxRQUFRO1FBQ04sT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDN0I7Ozs7O0lBRUQsUUFBUSxDQUFDLEtBQVU7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUN0Qzs7Ozs7SUFHRixRQUFRLENBQUMsUUFBUTtRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxRQUFRO1lBQ2xDLFFBQVMsQ0FBQyx1QkFBdUIsQ0FDOUMsVUFBVSxFQUNWLFFBQVEsQ0FDVCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO0tBQ0o7Ozs7O0lBRUQsb0JBQW9CLENBQUMsV0FBZ0I7UUFDbkMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztTQUN2QjthQUFNOzs7WUFHTCxJQUFJLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7U0FDeEM7S0FDRjs7O1lBOURGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxvU0FBbUQ7Z0JBRW5ELElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUM7O2FBQzdCOzs7b0JBTUUsU0FBUyxTQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Rm9ybUNvbnRyb2wsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtcclxuICBJQWZ0ZXJHdWlBdHRhY2hlZFBhcmFtcyxcclxuICBJRG9lc0ZpbHRlclBhc3NQYXJhbXMsXHJcbiAgSUZpbHRlclBhcmFtcyxcclxuICBSb3dOb2RlLFxyXG4gIElGbG9hdGluZ0ZpbHRlcixcclxuICBOdW1iZXJGaWx0ZXIsXHJcbiAgTnVtYmVyRmlsdGVyTW9kZWwsXHJcbiAgSUZsb2F0aW5nRmlsdGVyUGFyYW1zLFxyXG59IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcbmltcG9ydCB7IEFnRnJhbWV3b3JrQ29tcG9uZW50IH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBJRmlsdGVyQW5ndWxhckNvbXAgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1idG4tY2hlY2tib3gtZmlsdGVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuc2NzcyddLFxyXG4gIGhvc3Q6IHsnY2xhc3MnOiAnaG9zdENsYXNzJ31cclxufSlcclxuZXhwb3J0IGNsYXNzIEJ0bkNoZWNrYm94RmlsdGVyQ29tcG9uZW50IGltcGxlbWVudHMgSUZsb2F0aW5nRmlsdGVyLCBBZ0ZyYW1ld29ya0NvbXBvbmVudDxJRmxvYXRpbmdGaWx0ZXJQYXJhbXM+ICAge1xyXG4gIHByaXZhdGUgcGFyYW1zOiBJRmxvYXRpbmdGaWx0ZXJQYXJhbXM7XHJcbiAgcHJpdmF0ZSB2YWx1ZUdldHRlcjogKHJvd05vZGU6IFJvd05vZGUpID0+IGFueTtcclxuICBwdWJsaWMgdGV4dDogc3RyaW5nID0gJyc7XHJcbiAgcHVibGljIGN1cnJlbnRWYWx1ZTogbnVtYmVyO1xyXG4gIEBWaWV3Q2hpbGQoJ2lucHV0JywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIHB1YmxpYyBpbnB1dDtcclxuXHJcbiAgYWdJbml0KHBhcmFtczogSUZsb2F0aW5nRmlsdGVyUGFyYW1zKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIHRoaXMudmFsdWVHZXR0ZXIgPSBwYXJhbXMuZmlsdGVyUGFyYW1zLnZhbHVlR2V0dGVyO1xyXG4gICAgdGhpcy5wYXJhbXMuc3VwcHJlc3NGaWx0ZXJCdXR0b249dHJ1ZTtcclxuICB9XHJcblxyXG4gIGlzRmlsdGVyQWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dCAhPSBudWxsICYmIHRoaXMudGV4dCAhPT0gJyc7XHJcbiAgfVxyXG5cclxuICBkb2VzRmlsdGVyUGFzcyhwYXJhbXM6IElEb2VzRmlsdGVyUGFzc1BhcmFtcyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dFxyXG4gICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAuc3BsaXQoJyAnKVxyXG4gICAgICAuZXZlcnkoXHJcbiAgICAgICAgKGZpbHRlcldvcmQpID0+XHJcbiAgICAgICAgICB0aGlzLnZhbHVlR2V0dGVyKHBhcmFtcy5ub2RlKVxyXG4gICAgICAgICAgICAudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICAuaW5kZXhPZihmaWx0ZXJXb3JkKSA+PSAwXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXRNb2RlbCgpOiBhbnkge1xyXG4gICAgcmV0dXJuIHsgdmFsdWU6IHRoaXMudGV4dCB9O1xyXG4gIH1cclxuXHJcbiAgc2V0TW9kZWwobW9kZWw6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy50ZXh0ID0gbW9kZWwgPyBtb2RlbC52YWx1ZSA6ICcnO1xyXG4gIH1cclxuXHJcblxyXG4gb25DaGFuZ2UobmV3VmFsdWUpOiB2b2lkIHtcclxuICAgIHRoaXMucGFyYW1zLnBhcmVudEZpbHRlckluc3RhbmNlKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xyXG4gICAgICAoPE51bWJlckZpbHRlcj5pbnN0YW5jZSkub25GbG9hdGluZ0ZpbHRlckNoYW5nZWQoXHJcbiAgICAgICAgJ2NvbnRhaW5zJyxcclxuICAgICAgICBuZXdWYWx1ZVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvblBhcmVudE1vZGVsQ2hhbmdlZChwYXJlbnRNb2RlbDogYW55KTogdm9pZCB7XHJcbiAgICBpZiAoIXBhcmVudE1vZGVsKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIG5vdGUgdGhhdCB0aGUgZmlsdGVyIGNvdWxkIGJlIGFueXRoaW5nIGhlcmUsIGJ1dCBvdXIgcHVycG9zZXMgd2UncmUgYXNzdW1pbmcgYSBncmVhdGVyIHRoYW4gZmlsdGVyIG9ubHksXHJcbiAgICAgIC8vIHNvIGp1c3QgcmVhZCBvZmYgdGhlIHZhbHVlIGFuZCB1c2UgdGhhdFxyXG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHBhcmVudE1vZGVsLmZpbHRlcjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19