import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/checkbox";
export class BtnCheckboxRenderedComponent {
    agInit(params) {
        this.params = params;
    }
    refresh(params) {
        this.params = params;
        return true;
    }
    invokeParentMethod() {
        this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`);
    }
    btnCheckedHandler(event) {
        let checked = !event.target.firstElementChild.checked;
        let colId = this.params.column.colId;
        this.params.value = checked;
        this.params.api.undoRedoService.isFilling = true;
        this.params.node.setDataValue(colId, checked);
    }
    getParams() {
        return this.params;
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
    }
}
/** @nocollapse */ BtnCheckboxRenderedComponent.ɵfac = function BtnCheckboxRenderedComponent_Factory(t) { return new (t || BtnCheckboxRenderedComponent)(); };
/** @nocollapse */ BtnCheckboxRenderedComponent.ɵcmp = i0.ɵɵdefineComponent({ type: BtnCheckboxRenderedComponent, selectors: [["app-btn-checkbox-rendered"]], decls: 1, vars: 2, consts: [[3, "value", "checked", "click"]], template: function BtnCheckboxRenderedComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "mat-checkbox", 0);
        i0.ɵɵlistener("click", function BtnCheckboxRenderedComponent_Template_mat_checkbox_click_0_listener($event) { return ctx.btnCheckedHandler($event); });
        i0.ɵɵelementEnd();
    } if (rf & 2) {
        i0.ɵɵproperty("value", ctx.params.value)("checked", ctx.params.value);
    } }, directives: [i1.MatCheckbox], styles: [""] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BtnCheckboxRenderedComponent, [{
        type: Component,
        args: [{
                selector: 'app-btn-checkbox-rendered',
                templateUrl: './btn-checkbox-rendered.component.html',
                styleUrls: ['./btn-checkbox-rendered.component.css']
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiYnRuLWNoZWNrYm94LXJlbmRlcmVkL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQudHMiLCJidG4tY2hlY2tib3gtcmVuZGVyZWQvYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQWEsTUFBTSxlQUFlLENBQUM7OztBQU9yRCxNQUFNLE9BQU8sNEJBQTRCO0lBSXZDLE1BQU0sQ0FBQyxNQUFXO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBVztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxrQkFBa0I7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUNsRCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDM0UsQ0FBQztJQUNKLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFLO1FBQ3JCLElBQUksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7UUFDdEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLE9BQU8sQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBR2hELENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1QsOENBQThDO0lBQ2hELENBQUM7OzJIQXBDVSw0QkFBNEI7b0ZBQTVCLDRCQUE0QjtRQ1J6Qyx1Q0FBa0g7UUFBcEcscUhBQVMsNkJBQXlCLElBQUM7UUFBa0QsaUJBQWU7O1FBQWhFLHdDQUFzQiw2QkFBQTs7a0REUTNELDRCQUE0QjtjQUx4QyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsV0FBVyxFQUFFLHdDQUF3QztnQkFDckQsU0FBUyxFQUFFLENBQUMsdUNBQXVDLENBQUM7YUFDckQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1idG4tY2hlY2tib3gtcmVuZGVyZWQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEJ0bkNoZWNrYm94UmVuZGVyZWRDb21wb25lbnQgaW1wbGVtZW50cyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAsIE9uRGVzdHJveSB7XHJcblxyXG4gIHB1YmxpYyBwYXJhbXM6IGFueTtcclxuXHJcbiAgYWdJbml0KHBhcmFtczogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICB9XHJcblxyXG4gIHJlZnJlc2gocGFyYW1zOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbnZva2VQYXJlbnRNZXRob2QoKSB7XHJcbiAgICB0aGlzLnBhcmFtcy5jb250ZXh0LmNvbXBvbmVudFBhcmVudC5tZXRob2RGcm9tUGFyZW50KFxyXG4gICAgICBgUm93OiAke3RoaXMucGFyYW1zLm5vZGUucm93SW5kZXh9LCBDb2w6ICR7dGhpcy5wYXJhbXMuY29sRGVmLmhlYWRlck5hbWV9YFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGJ0bkNoZWNrZWRIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICBsZXQgY2hlY2tlZCA9ICFldmVudC50YXJnZXQuZmlyc3RFbGVtZW50Q2hpbGQuY2hlY2tlZDtcclxuICAgIGxldCBjb2xJZCA9IHRoaXMucGFyYW1zLmNvbHVtbi5jb2xJZDtcclxuICAgIHRoaXMucGFyYW1zLnZhbHVlPWNoZWNrZWQ7XHJcbiAgICB0aGlzLnBhcmFtcy5hcGkudW5kb1JlZG9TZXJ2aWNlLmlzRmlsbGluZz10cnVlO1xyXG4gICAgdGhpcy5wYXJhbXMubm9kZS5zZXREYXRhVmFsdWUoY29sSWQsIGNoZWNrZWQpO1xyXG5cclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZ2V0UGFyYW1zKCl7XHJcbiAgICByZXR1cm4gdGhpcy5wYXJhbXM7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIC8vIG5vIG5lZWQgdG8gcmVtb3ZlIHRoZSBidXR0b24gY2xpY2sgaGFuZGxlciBcclxuICB9XHJcblxyXG59XHJcbiIsIjxtYXQtY2hlY2tib3ggKGNsaWNrKT1cImJ0bkNoZWNrZWRIYW5kbGVyKCRldmVudClcIiBbdmFsdWVdPVwicGFyYW1zLnZhbHVlXCIgW2NoZWNrZWRdPVwicGFyYW1zLnZhbHVlXCI+IDwvbWF0LWNoZWNrYm94PiJdfQ==