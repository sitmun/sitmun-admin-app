import { Component, ViewChild, ViewContainerRef } from '@angular/core';
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
BtnCheckboxFilterComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-btn-checkbox-filter',
                template: "<select  #filterSelect  (change)='onChange(filterSelect.value)'>\r\n    <option value=\"\">{{\"selectAll\" | translate}}</option>\r\n    <option value=\"true\">{{\"enabled\" | translate}}</option>\r\n    <option value=\"false\">{{\"disabled\" | translate}}</option>\r\n  </select>",
                host: { 'class': 'hostClass' },
                styles: [".hostClass{width:100%}"]
            },] }
];
BtnCheckboxFilterComponent.propDecorators = {
    input: [{ type: ViewChild, args: ['input', { read: ViewContainerRef },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliL2J0bi1jaGVja2JveC1maWx0ZXIvYnRuLWNoZWNrYm94LWZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFxQnZFLE1BQU0sT0FBTywwQkFBMEI7SUFOdkM7UUFTUyxTQUFJLEdBQVcsRUFBRSxDQUFDO0lBc0QzQixDQUFDO0lBbERDLE1BQU0sQ0FBQyxNQUE2QjtRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEdBQUMsSUFBSSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQTZCO1FBQzFDLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixXQUFXLEVBQUU7YUFDYixLQUFLLENBQUMsR0FBRyxDQUFDO2FBQ1YsS0FBSyxDQUNKLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FDYixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDMUIsUUFBUSxFQUFFO2FBQ1YsV0FBVyxFQUFFO2FBQ2IsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FDOUIsQ0FBQztJQUNOLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUdGLFFBQVEsQ0FBQyxRQUFRO1FBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLFFBQVE7WUFDbEMsUUFBUyxDQUFDLHVCQUF1QixDQUM5QyxVQUFVLEVBQ1YsUUFBUSxDQUNULENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxXQUFnQjtRQUNuQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFDTCwyR0FBMkc7WUFDM0csMENBQTBDO1lBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztTQUN4QztJQUNILENBQUM7OztZQTlERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsb1NBQW1EO2dCQUVuRCxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFDOzthQUM3Qjs7O29CQU1FLFNBQVMsU0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0Zvcm1Db250cm9sLCBWYWxpZGF0b3JzfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7XHJcbiAgSUFmdGVyR3VpQXR0YWNoZWRQYXJhbXMsXHJcbiAgSURvZXNGaWx0ZXJQYXNzUGFyYW1zLFxyXG4gIElGaWx0ZXJQYXJhbXMsXHJcbiAgUm93Tm9kZSxcclxuICBJRmxvYXRpbmdGaWx0ZXIsXHJcbiAgTnVtYmVyRmlsdGVyLFxyXG4gIE51bWJlckZpbHRlck1vZGVsLFxyXG4gIElGbG9hdGluZ0ZpbHRlclBhcmFtcyxcclxufSBmcm9tICdAYWctZ3JpZC1jb21tdW5pdHkvYWxsLW1vZHVsZXMnO1xyXG5pbXBvcnQgeyBBZ0ZyYW1ld29ya0NvbXBvbmVudCB9IGZyb20gJ0BhZy1ncmlkLWNvbW11bml0eS9hbmd1bGFyJztcclxuaW1wb3J0IHsgSUZpbHRlckFuZ3VsYXJDb21wIH0gZnJvbSAnQGFnLWdyaWQtY29tbXVuaXR5L2FuZ3VsYXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtYnRuLWNoZWNrYm94LWZpbHRlcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2J0bi1jaGVja2JveC1maWx0ZXIuY29tcG9uZW50LnNjc3MnXSxcclxuICBob3N0OiB7J2NsYXNzJzogJ2hvc3RDbGFzcyd9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBCdG5DaGVja2JveEZpbHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIElGbG9hdGluZ0ZpbHRlciwgQWdGcmFtZXdvcmtDb21wb25lbnQ8SUZsb2F0aW5nRmlsdGVyUGFyYW1zPiAgIHtcclxuICBwcml2YXRlIHBhcmFtczogSUZsb2F0aW5nRmlsdGVyUGFyYW1zO1xyXG4gIHByaXZhdGUgdmFsdWVHZXR0ZXI6IChyb3dOb2RlOiBSb3dOb2RlKSA9PiBhbnk7XHJcbiAgcHVibGljIHRleHQ6IHN0cmluZyA9ICcnO1xyXG4gIHB1YmxpYyBjdXJyZW50VmFsdWU6IG51bWJlcjtcclxuICBAVmlld0NoaWxkKCdpbnB1dCcsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSBwdWJsaWMgaW5wdXQ7XHJcblxyXG4gIGFnSW5pdChwYXJhbXM6IElGbG9hdGluZ0ZpbHRlclBhcmFtcyk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICB0aGlzLnZhbHVlR2V0dGVyID0gcGFyYW1zLmZpbHRlclBhcmFtcy52YWx1ZUdldHRlcjtcclxuICAgIHRoaXMucGFyYW1zLnN1cHByZXNzRmlsdGVyQnV0dG9uPXRydWU7XHJcbiAgfVxyXG5cclxuICBpc0ZpbHRlckFjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnRleHQgIT0gbnVsbCAmJiB0aGlzLnRleHQgIT09ICcnO1xyXG4gIH1cclxuXHJcbiAgZG9lc0ZpbHRlclBhc3MocGFyYW1zOiBJRG9lc0ZpbHRlclBhc3NQYXJhbXMpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRcclxuICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgLnNwbGl0KCcgJylcclxuICAgICAgLmV2ZXJ5KFxyXG4gICAgICAgIChmaWx0ZXJXb3JkKSA9PlxyXG4gICAgICAgICAgdGhpcy52YWx1ZUdldHRlcihwYXJhbXMubm9kZSlcclxuICAgICAgICAgICAgLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgLmluZGV4T2YoZmlsdGVyV29yZCkgPj0gMFxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0TW9kZWwoKTogYW55IHtcclxuICAgIHJldHVybiB7IHZhbHVlOiB0aGlzLnRleHQgfTtcclxuICB9XHJcblxyXG4gIHNldE1vZGVsKG1vZGVsOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMudGV4dCA9IG1vZGVsID8gbW9kZWwudmFsdWUgOiAnJztcclxuICB9XHJcblxyXG5cclxuIG9uQ2hhbmdlKG5ld1ZhbHVlKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhcmFtcy5wYXJlbnRGaWx0ZXJJbnN0YW5jZShmdW5jdGlvbiAoaW5zdGFuY2UpIHtcclxuICAgICAgKDxOdW1iZXJGaWx0ZXI+aW5zdGFuY2UpLm9uRmxvYXRpbmdGaWx0ZXJDaGFuZ2VkKFxyXG4gICAgICAgICdjb250YWlucycsXHJcbiAgICAgICAgbmV3VmFsdWVcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25QYXJlbnRNb2RlbENoYW5nZWQocGFyZW50TW9kZWw6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKCFwYXJlbnRNb2RlbCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBub3RlIHRoYXQgdGhlIGZpbHRlciBjb3VsZCBiZSBhbnl0aGluZyBoZXJlLCBidXQgb3VyIHB1cnBvc2VzIHdlJ3JlIGFzc3VtaW5nIGEgZ3JlYXRlciB0aGFuIGZpbHRlciBvbmx5LFxyXG4gICAgICAvLyBzbyBqdXN0IHJlYWQgb2ZmIHRoZSB2YWx1ZSBhbmQgdXNlIHRoYXRcclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBwYXJlbnRNb2RlbC5maWx0ZXI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==