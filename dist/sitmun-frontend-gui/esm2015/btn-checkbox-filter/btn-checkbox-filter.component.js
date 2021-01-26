import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@ngx-translate/core";
const _c0 = ["input"];
export class BtnCheckboxFilterComponent {
    constructor() {
        this.text = '';
    }
    agInit(params) {
        this.params = params;
        this.valueGetter = params.filterParams.valueGetter;
        this.params.suppressFilterButton = true;
    }
    isFilterActive() {
        return this.text != null && this.text !== '';
    }
    doesFilterPass(params) {
        return this.text
            .toLowerCase()
            .split(' ')
            .every((filterWord) => this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0);
    }
    getModel() {
        return { value: this.text };
    }
    setModel(model) {
        this.text = model ? model.value : '';
    }
    onChange(newValue) {
        this.params.parentFilterInstance(function (instance) {
            instance.onFloatingFilterChanged('contains', newValue);
        });
    }
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
/** @nocollapse */ BtnCheckboxFilterComponent.ɵfac = function BtnCheckboxFilterComponent_Factory(t) { return new (t || BtnCheckboxFilterComponent)(); };
/** @nocollapse */ BtnCheckboxFilterComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BtnCheckboxFilterComponent, selectors: [["app-btn-checkbox-filter"]], viewQuery: function BtnCheckboxFilterComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, true, ViewContainerRef);
    } if (rf & 2) {
        var _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.input = _t.first);
    } }, hostAttrs: [1, "hostClass"], decls: 11, vars: 9, consts: [[3, "change"], ["filterSelect", ""], ["value", ""], ["value", "true"], ["value", "false"]], template: function BtnCheckboxFilterComponent_Template(rf, ctx) { if (rf & 1) {
        const _r1 = i0.ɵɵgetCurrentView();
        i0.ɵɵelementStart(0, "select", 0, 1);
        i0.ɵɵlistener("change", function BtnCheckboxFilterComponent_Template_select_change_0_listener() { i0.ɵɵrestoreView(_r1); const _r0 = i0.ɵɵreference(1); return ctx.onChange(_r0.value); });
        i0.ɵɵelementStart(2, "option", 2);
        i0.ɵɵtext(3);
        i0.ɵɵpipe(4, "translate");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(5, "option", 3);
        i0.ɵɵtext(6);
        i0.ɵɵpipe(7, "translate");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(8, "option", 4);
        i0.ɵɵtext(9);
        i0.ɵɵpipe(10, "translate");
        i0.ɵɵelementEnd();
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(4, 3, "selectAll"));
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(7, 5, "enabled"));
        i0.ɵɵadvance(3);
        i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(10, 7, "disabled"));
    } }, directives: [i1.NgSelectOption, i1.ɵangular_packages_forms_forms_x], pipes: [i2.TranslatePipe], styles: [".hostClass[_ngcontent-%COMP%]{width:100%}"] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BtnCheckboxFilterComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-checkbox-filter',
                templateUrl: './btn-checkbox-filter.component.html',
                styleUrls: ['./btn-checkbox-filter.component.css'],
                host: { 'class': 'hostClass' }
            }]
    }], null, { input: [{
            type: ViewChild,
            args: ['input', { read: ViewContainerRef }]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vc3JjL21haW4vYW5ndWxhci1saWJyYXJ5L3Byb2plY3RzL3NpdG11bi1mcm9udGVuZC1ndWkvc3JjL2xpYi8iLCJzb3VyY2VzIjpbImJ0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQudHMiLCJidG4tY2hlY2tib3gtZmlsdGVyL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7O0FBcUJ2RSxNQUFNLE9BQU8sMEJBQTBCO0lBTnZDO1FBU1MsU0FBSSxHQUFXLEVBQUUsQ0FBQztLQXNEMUI7SUFsREMsTUFBTSxDQUFDLE1BQTZCO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBQyxJQUFJLENBQUM7SUFDeEMsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxjQUFjLENBQUMsTUFBNkI7UUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLFdBQVcsRUFBRTthQUNiLEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixLQUFLLENBQ0osQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUMxQixRQUFRLEVBQUU7YUFDVixXQUFXLEVBQUU7YUFDYixPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUM5QixDQUFDO0lBQ04sQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQVU7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBR0YsUUFBUSxDQUFDLFFBQVE7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsUUFBUTtZQUNsQyxRQUFTLENBQUMsdUJBQXVCLENBQzlDLFVBQVUsRUFDVixRQUFRLENBQ1QsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9CQUFvQixDQUFDLFdBQWdCO1FBQ25DLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLDJHQUEyRztZQUMzRywwQ0FBMEM7WUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQzs7dUhBeERVLDBCQUEwQjtrRkFBMUIsMEJBQTBCO2tDQUtULGdCQUFnQjs7Ozs7O1FDMUI5QyxvQ0FDSTtRQURvQiwrSkFBVSx1QkFBNEIsSUFBQztRQUMzRCxpQ0FBaUI7UUFBQSxZQUEyQjs7UUFBQSxpQkFBUztRQUNyRCxpQ0FBcUI7UUFBQSxZQUF5Qjs7UUFBQSxpQkFBUztRQUN2RCxpQ0FBc0I7UUFBQSxZQUEwQjs7UUFBQSxpQkFBUztRQUMzRCxpQkFBUzs7UUFIVSxlQUEyQjtRQUEzQix1REFBMkI7UUFDdkIsZUFBeUI7UUFBekIscURBQXlCO1FBQ3hCLGVBQTBCO1FBQTFCLHVEQUEwQjs7a0REa0J2QywwQkFBMEI7Y0FOdEMsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSx5QkFBeUI7Z0JBQ25DLFdBQVcsRUFBRSxzQ0FBc0M7Z0JBQ25ELFNBQVMsRUFBRSxDQUFDLHFDQUFxQyxDQUFDO2dCQUNsRCxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFDO2FBQzdCO2dCQU13RCxLQUFLO2tCQUEzRCxTQUFTO21CQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Rm9ybUNvbnRyb2wsIFZhbGlkYXRvcnN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHtcclxuICBJQWZ0ZXJHdWlBdHRhY2hlZFBhcmFtcyxcclxuICBJRG9lc0ZpbHRlclBhc3NQYXJhbXMsXHJcbiAgSUZpbHRlclBhcmFtcyxcclxuICBSb3dOb2RlLFxyXG4gIElGbG9hdGluZ0ZpbHRlcixcclxuICBOdW1iZXJGaWx0ZXIsXHJcbiAgTnVtYmVyRmlsdGVyTW9kZWwsXHJcbiAgSUZsb2F0aW5nRmlsdGVyUGFyYW1zLFxyXG59IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbGwtbW9kdWxlcyc7XHJcbmltcG9ydCB7IEFnRnJhbWV3b3JrQ29tcG9uZW50IH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5pbXBvcnQgeyBJRmlsdGVyQW5ndWxhckNvbXAgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1idG4tY2hlY2tib3gtZmlsdGVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuY3NzJ10sXHJcbiAgaG9zdDogeydjbGFzcyc6ICdob3N0Q2xhc3MnfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQnRuQ2hlY2tib3hGaWx0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBJRmxvYXRpbmdGaWx0ZXIsIEFnRnJhbWV3b3JrQ29tcG9uZW50PElGbG9hdGluZ0ZpbHRlclBhcmFtcz4gICB7XHJcbiAgcHJpdmF0ZSBwYXJhbXM6IElGbG9hdGluZ0ZpbHRlclBhcmFtcztcclxuICBwcml2YXRlIHZhbHVlR2V0dGVyOiAocm93Tm9kZTogUm93Tm9kZSkgPT4gYW55O1xyXG4gIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSAnJztcclxuICBwdWJsaWMgY3VycmVudFZhbHVlOiBudW1iZXI7XHJcbiAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYgfSkgcHVibGljIGlucHV0O1xyXG5cclxuICBhZ0luaXQocGFyYW1zOiBJRmxvYXRpbmdGaWx0ZXJQYXJhbXMpOiB2b2lkIHtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy52YWx1ZUdldHRlciA9IHBhcmFtcy5maWx0ZXJQYXJhbXMudmFsdWVHZXR0ZXI7XHJcbiAgICB0aGlzLnBhcmFtcy5zdXBwcmVzc0ZpbHRlckJ1dHRvbj10cnVlO1xyXG4gIH1cclxuXHJcbiAgaXNGaWx0ZXJBY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ICE9IG51bGwgJiYgdGhpcy50ZXh0ICE9PSAnJztcclxuICB9XHJcblxyXG4gIGRvZXNGaWx0ZXJQYXNzKHBhcmFtczogSURvZXNGaWx0ZXJQYXNzUGFyYW1zKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0XHJcbiAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIC5zcGxpdCgnICcpXHJcbiAgICAgIC5ldmVyeShcclxuICAgICAgICAoZmlsdGVyV29yZCkgPT5cclxuICAgICAgICAgIHRoaXMudmFsdWVHZXR0ZXIocGFyYW1zLm5vZGUpXHJcbiAgICAgICAgICAgIC50b1N0cmluZygpXHJcbiAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIC5pbmRleE9mKGZpbHRlcldvcmQpID49IDBcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIGdldE1vZGVsKCk6IGFueSB7XHJcbiAgICByZXR1cm4geyB2YWx1ZTogdGhpcy50ZXh0IH07XHJcbiAgfVxyXG5cclxuICBzZXRNb2RlbChtb2RlbDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnRleHQgPSBtb2RlbCA/IG1vZGVsLnZhbHVlIDogJyc7XHJcbiAgfVxyXG5cclxuXHJcbiBvbkNoYW5nZShuZXdWYWx1ZSk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXJhbXMucGFyZW50RmlsdGVySW5zdGFuY2UoZnVuY3Rpb24gKGluc3RhbmNlKSB7XHJcbiAgICAgICg8TnVtYmVyRmlsdGVyPmluc3RhbmNlKS5vbkZsb2F0aW5nRmlsdGVyQ2hhbmdlZChcclxuICAgICAgICAnY29udGFpbnMnLFxyXG4gICAgICAgIG5ld1ZhbHVlXHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uUGFyZW50TW9kZWxDaGFuZ2VkKHBhcmVudE1vZGVsOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmICghcGFyZW50TW9kZWwpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gbm90ZSB0aGF0IHRoZSBmaWx0ZXIgY291bGQgYmUgYW55dGhpbmcgaGVyZSwgYnV0IG91ciBwdXJwb3NlcyB3ZSdyZSBhc3N1bWluZyBhIGdyZWF0ZXIgdGhhbiBmaWx0ZXIgb25seSxcclxuICAgICAgLy8gc28ganVzdCByZWFkIG9mZiB0aGUgdmFsdWUgYW5kIHVzZSB0aGF0XHJcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gcGFyZW50TW9kZWwuZmlsdGVyO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCI8c2VsZWN0ICAjZmlsdGVyU2VsZWN0ICAoY2hhbmdlKT0nb25DaGFuZ2UoZmlsdGVyU2VsZWN0LnZhbHVlKSc+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e3tcInNlbGVjdEFsbFwiIHwgdHJhbnNsYXRlfX08L29wdGlvbj5cclxuICAgIDxvcHRpb24gdmFsdWU9XCJ0cnVlXCI+e3tcImVuYWJsZWRcIiB8IHRyYW5zbGF0ZX19PC9vcHRpb24+XHJcbiAgICA8b3B0aW9uIHZhbHVlPVwiZmFsc2VcIj57e1wiZGlzYWJsZWRcIiB8IHRyYW5zbGF0ZX19PC9vcHRpb24+XHJcbiAgPC9zZWxlY3Q+Il19