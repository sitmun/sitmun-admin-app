import { Component } from '@angular/core';
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
        if (this.params.colDef.editable) {
            let checked = !event.target.firstElementChild.checked;
            let colId = this.params.column.colId;
            this.params.value = checked;
            this.params.api.undoRedoService.isFilling = true;
            this.params.node.setDataValue(colId, checked);
        }
        else {
            event.preventDefault();
        }
    }
    getParams() {
        return this.params;
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
    }
}
BtnCheckboxRenderedComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-btn-checkbox-rendered',
                template: "<mat-checkbox (click)=\"btnCheckedHandler($event)\" [value]=\"params.value\" [checked]=\"params.value\"> </mat-checkbox>",
                styles: [""]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LXJlbmRlcmVkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2FuZ3VsYXItbGlicmFyeS9wcm9qZWN0cy9zaXRtdW4tZnJvbnRlbmQtZ3VpL3NyYy9saWIvYnRuLWNoZWNrYm94LXJlbmRlcmVkL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQU9yRCxNQUFNLE9BQU8sNEJBQTRCO0lBSXZDLE1BQU0sQ0FBQyxNQUFXO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBVztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxrQkFBa0I7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUNsRCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FDM0UsQ0FBQztJQUNKLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFLO1FBQ3JCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDO1lBQzdCLElBQUksT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7WUFDdEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLE9BQU8sQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFDLElBQUksQ0FBQztZQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQy9DO2FBQ0c7WUFDRixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDeEI7SUFHSCxDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsV0FBVztRQUNULDhDQUE4QztJQUNoRCxDQUFDOzs7WUE5Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLG9JQUFxRDs7YUFFdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ2VsbFJlbmRlcmVyQW5ndWxhckNvbXAgfSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYW5ndWxhcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1idG4tY2hlY2tib3gtcmVuZGVyZWQnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9idG4tY2hlY2tib3gtcmVuZGVyZWQuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2J0bi1jaGVja2JveC1yZW5kZXJlZC5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCdG5DaGVja2JveFJlbmRlcmVkQ29tcG9uZW50IGltcGxlbWVudHMgSUNlbGxSZW5kZXJlckFuZ3VsYXJDb21wLCBPbkRlc3Ryb3kge1xyXG5cclxuICBwdWJsaWMgcGFyYW1zOiBhbnk7XHJcblxyXG4gIGFnSW5pdChwYXJhbXM6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgfVxyXG5cclxuICByZWZyZXNoKHBhcmFtczogYW55KTogYm9vbGVhbiB7XHJcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgIFxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW52b2tlUGFyZW50TWV0aG9kKCkge1xyXG4gICAgdGhpcy5wYXJhbXMuY29udGV4dC5jb21wb25lbnRQYXJlbnQubWV0aG9kRnJvbVBhcmVudChcclxuICAgICAgYFJvdzogJHt0aGlzLnBhcmFtcy5ub2RlLnJvd0luZGV4fSwgQ29sOiAke3RoaXMucGFyYW1zLmNvbERlZi5oZWFkZXJOYW1lfWBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBidG5DaGVja2VkSGFuZGxlcihldmVudCkge1xyXG4gICAgaWYodGhpcy5wYXJhbXMuY29sRGVmLmVkaXRhYmxlKXtcclxuICAgICAgbGV0IGNoZWNrZWQgPSAhZXZlbnQudGFyZ2V0LmZpcnN0RWxlbWVudENoaWxkLmNoZWNrZWQ7XHJcbiAgICAgIGxldCBjb2xJZCA9IHRoaXMucGFyYW1zLmNvbHVtbi5jb2xJZDtcclxuICAgICAgdGhpcy5wYXJhbXMudmFsdWU9Y2hlY2tlZDtcclxuICAgICAgdGhpcy5wYXJhbXMuYXBpLnVuZG9SZWRvU2VydmljZS5pc0ZpbGxpbmc9dHJ1ZTtcclxuICAgICAgdGhpcy5wYXJhbXMubm9kZS5zZXREYXRhVmFsdWUoY29sSWQsIGNoZWNrZWQpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICB9XHJcblxyXG4gIGdldFBhcmFtcygpe1xyXG4gICAgcmV0dXJuIHRoaXMucGFyYW1zO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAvLyBubyBuZWVkIHRvIHJlbW92ZSB0aGUgYnV0dG9uIGNsaWNrIGhhbmRsZXIgXHJcbiAgfVxyXG5cclxufVxyXG4iXX0=