/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
export class DatagraphComponent {
    constructor() {
        this.margin = { top: 20, bottom: 60, left: 40, right: 40 };
        this.margin2 = 80;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.type == "bar") {
            this.createBarChart();
            if (this.data) {
                this.updateBarChart();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.type == "bar") {
            if (this.chart) {
                this.updateBarChart();
            }
        }
    }
    /**
     * @return {?}
     */
    createBarChart() {
        /** @type {?} */
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        /** @type {?} */
        let svg = d3.select(element).append('svg')
            .attr('width', '100%')
            .attr("height", '100%');
        // chart plot area
        this.chart = svg.append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        /** @type {?} */
        const barGroups = this.chart.selectAll()
            .data(this.data)
            .enter()
            .append('g');
        /** @type {?} */
        let xDomain = this.data.map(d => d.index);
        /** @type {?} */
        let yDomain = [0, (d3.max(this.data, d => d.value))];
        // create scales
        this.xScale = d3.scaleBand().padding(0.3).domain(xDomain).rangeRound([0, this.width]);
        this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);
        // bar colors
        // this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);
        barGroups
            .append('text')
            .attr('class', 'value')
            .attr('x', (a) => this.xScale(a.index) + this.xScale.bandwidth() / 2)
            .attr('y', (a) => this.yScale(a.value) - 5)
            .attr('text-anchor', 'middle')
            .style("font-size", 9)
            .style("fill", "black")
            .text((a) => `${a.value}`);
        // x & y axis
        this.xAxis = svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 9)
            .style("fill", "black");
        this.yAxis = svg.append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale))
            .selectAll("text")
            .style("font-size", 9)
            .style("fill", "black");
    }
    /**
     * @return {?}
     */
    updateBarChart() {
        // update scales & axis
        this.xScale.domain(this.data.map(d => d.index));
        this.yScale.domain([0, (d3.max(this.data, d => d.value))]);
        this.xAxis.transition().call(d3.axisBottom(this.xScale));
        this.yAxis.transition().call(d3.axisLeft(this.yScale));
        /** @type {?} */
        let update = this.chart.selectAll('.bar')
            .data(this.data);
        // remove exiting bars
        update.exit().remove();
        // update existing bars
        this.chart.selectAll('.bar').transition()
            .attr('x', d => this.xScale(d.index))
            .attr('y', d => this.yScale(d.value))
            .attr('width', d => this.xScale.bandwidth())
            .attr('height', d => this.height - this.yScale(d[1]))
            .style('fill', '#be7d27');
        // add new bars
        update
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => this.xScale(d.index))
            .attr('y', d => this.yScale(d.value))
            .attr('height', d => this.height - this.yScale(d.value))
            .attr('width', this.xScale.bandwidth())
            .style('fill', '#be7d27')
            .transition()
            .delay((d, i) => i * 10);
    }
}
DatagraphComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-datagraph',
                template: "<div class=\"d3-chart\" #chart></div>",
                styles: [".d3-chart{background-color:rgba(189,185,181,.615686274509804);height:400px;margin:auto;width:100%}.d3-chart .axis line,.d3-chart .axis path{stroke:#999}.d3-chart .axis text{fill:#999}body{font-family:Open Sans,sans-serif}div#layout{text-align:center}svg{height:100%;width:100%}.bar{fill:#be7d27}text{fill:#fff;font-size:8px!important}line,path{stroke:grey}line#limit{stroke:#fed966;stroke-dasharray:3 6;stroke-width:3}.grid path{stroke-width:0}.grid .tick line{stroke:#9faaae;stroke-opacity:.3}text.divergence{fill:#2f4a6d;font-size:12px}.bars.value{font-size:8px!important;z-index:132132132}text.title{font-size:22px;font-weight:600}text.label{font-weight:400}text.label,text.source{font-size:8px!important}"]
            }] }
];
/** @nocollapse */
DatagraphComponent.ctorParameters = () => [];
DatagraphComponent.propDecorators = {
    chartContainer: [{ type: ViewChild, args: ['chart', { static: true },] }],
    data: [{ type: Input }],
    type: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    DatagraphComponent.prototype.chartContainer;
    /** @type {?} */
    DatagraphComponent.prototype.data;
    /** @type {?} */
    DatagraphComponent.prototype.type;
    /** @type {?} */
    DatagraphComponent.prototype.margin;
    /** @type {?} */
    DatagraphComponent.prototype.margin2;
    /** @type {?} */
    DatagraphComponent.prototype.chart;
    /** @type {?} */
    DatagraphComponent.prototype.width;
    /** @type {?} */
    DatagraphComponent.prototype.height;
    /** @type {?} */
    DatagraphComponent.prototype.xScale;
    /** @type {?} */
    DatagraphComponent.prototype.yScale;
    /** @type {?} */
    DatagraphComponent.prototype.colors;
    /** @type {?} */
    DatagraphComponent.prototype.xAxis;
    /** @type {?} */
    DatagraphComponent.prototype.yAxis;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyYXBoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbWFpbi9hbmd1bGFyLWxpYnJhcnkvcHJvamVjdHMvc2l0bXVuLWZyb250ZW5kLWd1aS9zcmMvbGliLyIsInNvdXJjZXMiOlsiZGF0YS1ncmFwaC9kYXRhZ3JhcGguY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFxQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDOUcsT0FBTyxLQUFLLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFRekIsTUFBTSxPQUFPLGtCQUFrQjtJQWdCN0I7c0JBWHNCLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBQzt1QkFDL0MsRUFBRTtLQVVIOzs7O0lBRWpCLFFBQVE7UUFFSixJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFDO1lBQ3BCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3ZCO1NBQ0Y7S0FFSjs7OztJQUdELFdBQVc7UUFDVCxJQUFHLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxFQUNyQjtZQUNFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDdkI7U0FDRjtLQUdGOzs7O0lBRUQsY0FBYzs7UUFDWixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1B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LENBQUM7YUFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQzthQUNwQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3ZELElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUN0QyxLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQzthQUN4QixVQUFVLEVBQUU7YUFDWixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUE7S0FFM0I7OztZQWpKRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLGlEQUF5Qzs7YUFFMUM7Ozs7OzZCQUdFLFNBQVMsU0FBQyxPQUFPLEVBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO21CQUNoQyxLQUFLO21CQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT25DaGFuZ2VzLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZGF0YWdyYXBoJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGF0YWdyYXBoLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kYXRhZ3JhcGguY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0YWdyYXBoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnY2hhcnQnLHtzdGF0aWM6IHRydWV9KSBwcml2YXRlIGNoYXJ0Q29udGFpbmVyOiBFbGVtZW50UmVmO1xyXG4gIEBJbnB1dCgpIHByaXZhdGUgZGF0YTogQXJyYXk8YW55PjtcclxuICBASW5wdXQoKSBwcml2YXRlIHR5cGU7XHJcbiAgcHJpdmF0ZSBtYXJnaW46IGFueSA9IHsgdG9wOiAyMCwgYm90dG9tOiA2MCwgbGVmdDogNDAsIHJpZ2h0OiA0MH07XHJcbiAgcHJpdmF0ZSBtYXJnaW4yID0gODA7XHJcbiAgcHJpdmF0ZSBjaGFydDogYW55O1xyXG4gIHByaXZhdGUgd2lkdGg6IG51bWJlcjtcclxuICBwcml2YXRlIGhlaWdodDogbnVtYmVyO1xyXG4gIHByaXZhdGUgeFNjYWxlOiBhbnk7XHJcbiAgcHJpdmF0ZSB5U2NhbGU6IGFueTtcclxuICBwcml2YXRlIGNvbG9yczogYW55O1xyXG4gIHByaXZhdGUgeEF4aXM6IGFueTtcclxuICBwcml2YXRlIHlBeGlzOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICAgICAgaWYodGhpcy50eXBlID09IFwiYmFyXCIpe1xyXG4gICAgICAgIHRoaXMuY3JlYXRlQmFyQ2hhcnQoKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUJhckNoYXJ0KCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICB9XHJcbiAgXHJcblxyXG4gIG5nT25DaGFuZ2VzKCkge1xyXG4gICAgaWYodGhpcy50eXBlID09IFwiYmFyXCIpXHJcbiAgICB7XHJcbiAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVCYXJDaGFydCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGNyZWF0ZUJhckNoYXJ0KCkge1xyXG4gICAgbGV0IGVsZW1lbnQgPSB0aGlzLmNoYXJ0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICB0aGlzLndpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aCAtIHRoaXMubWFyZ2luLmxlZnQgLSB0aGlzLm1hcmdpbi5yaWdodDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSB0aGlzLm1hcmdpbi50b3AgLSB0aGlzLm1hcmdpbi5ib3R0b207XHJcbiAgICBsZXQgc3ZnID0gZDMuc2VsZWN0KGVsZW1lbnQpLmFwcGVuZCgnc3ZnJylcclxuICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxyXG4gICAgICAuYXR0cihcImhlaWdodFwiLCAnMTAwJScpXHJcblxyXG4gICAgLy8gY2hhcnQgcGxvdCBhcmVhXHJcbiAgICB0aGlzLmNoYXJ0ID0gc3ZnLmFwcGVuZCgnZycpXHJcbiAgICAgIC5hdHRyKCdjbGFzcycsICdiYXJzJylcclxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt0aGlzLm1hcmdpbi5sZWZ0fSwgJHt0aGlzLm1hcmdpbi50b3B9KWApO1xyXG4gICAgICBcclxuICAgICAgY29uc3QgYmFyR3JvdXBzID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoKVxyXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXHJcbiAgICAgIC5lbnRlcigpXHJcbiAgICAgIC5hcHBlbmQoJ2cnKVxyXG5cclxuICBcclxuXHJcbiAgICAvLyBkZWZpbmUgWCAmIFkgZG9tYWluc1xyXG4gICAgbGV0IHhEb21haW4gPSB0aGlzLmRhdGEubWFwKGQgPT4gZC5pbmRleCk7XHJcbiAgICBsZXQgeURvbWFpbiA9IFswLCAoZDMubWF4KHRoaXMuZGF0YSwgZCA9PiBkLnZhbHVlKSldO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBzY2FsZXNcclxuICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGVCYW5kKCkucGFkZGluZygwLjMpLmRvbWFpbih4RG9tYWluKS5yYW5nZVJvdW5kKFswLCB0aGlzLndpZHRoXSk7XHJcbiAgICB0aGlzLnlTY2FsZSA9IGQzLnNjYWxlTGluZWFyKCkuZG9tYWluKHlEb21haW4pLnJhbmdlKFt0aGlzLmhlaWdodCwgMF0pO1xyXG5cclxuICAgIC8vIGJhciBjb2xvcnNcclxuICAgLy8gdGhpcy5jb2xvcnMgPSBkMy5zY2FsZUxpbmVhcigpLmRvbWFpbihbMCwgdGhpcy5kYXRhLmxlbmd0aF0pLnJhbmdlKDxhbnlbXT5bJ3JlZCcsICdibHVlJ10pO1xyXG4gICAgXHJcbiAgICBiYXJHcm91cHMgXHJcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAndmFsdWUnKVxyXG4gICAgICAuYXR0cigneCcsIChhKSA9PiB0aGlzLnhTY2FsZShhLmluZGV4KSArIHRoaXMueFNjYWxlLmJhbmR3aWR0aCgpIC8gMilcclxuICAgICAgLmF0dHIoJ3knLCAoYSkgPT4gdGhpcy55U2NhbGUoYS52YWx1ZSktNSlcclxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXHJcbiAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCA5KVxyXG4gICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiYmxhY2tcIilcclxuICAgICAgLnRleHQoKGEpID0+IGAke2EudmFsdWV9YClcclxuXHJcblxyXG4gICAgLy8geCAmIHkgYXhpc1xyXG4gICAgdGhpcy54QXhpcyA9IHN2Zy5hcHBlbmQoJ2cnKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLXgnKVxyXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3RoaXMubWFyZ2luLmxlZnR9LCAke3RoaXMubWFyZ2luLnRvcCArIHRoaXMuaGVpZ2h0fSlgKVxyXG4gICAgICAuY2FsbChkMy5heGlzQm90dG9tKHRoaXMueFNjYWxlKSlcclxuICAgICAgLnNlbGVjdEFsbChcInRleHRcIilcclxuICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoLTEwLDApcm90YXRlKC00NSlcIilcclxuICAgICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcclxuICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIDkpXHJcbiAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJibGFja1wiKVxyXG5cclxuICAgICAgXHJcbiAgICB0aGlzLnlBeGlzID0gc3ZnLmFwcGVuZCgnZycpXHJcbiAgICAgIC5hdHRyKCdjbGFzcycsICdheGlzIGF4aXMteScpXHJcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7dGhpcy5tYXJnaW4ubGVmdH0sICR7dGhpcy5tYXJnaW4udG9wfSlgKVxyXG4gICAgICAuY2FsbChkMy5heGlzTGVmdCh0aGlzLnlTY2FsZSkpXHJcbiAgICAgIC5zZWxlY3RBbGwoXCJ0ZXh0XCIpXHJcbiAgICAgIC5zdHlsZShcImZvbnQtc2l6ZVwiLCA5KVxyXG4gICAgICAuc3R5bGUoXCJmaWxsXCIsIFwiYmxhY2tcIilcclxuXHJcbiAgICAgIFxyXG4gIH1cclxuXHJcbiAgdXBkYXRlQmFyQ2hhcnQoKSB7XHJcbiAgICAvLyB1cGRhdGUgc2NhbGVzICYgYXhpc1xyXG4gICAgdGhpcy54U2NhbGUuZG9tYWluKHRoaXMuZGF0YS5tYXAoZCA9PiBkLmluZGV4KSk7XHJcbiAgICB0aGlzLnlTY2FsZS5kb21haW4oWzAsKGQzLm1heCh0aGlzLmRhdGEsIGQgPT4gZC52YWx1ZSkpXSk7XHJcbiAgICB0aGlzLnhBeGlzLnRyYW5zaXRpb24oKS5jYWxsKGQzLmF4aXNCb3R0b20odGhpcy54U2NhbGUpKTtcclxuICAgIHRoaXMueUF4aXMudHJhbnNpdGlvbigpLmNhbGwoZDMuYXhpc0xlZnQodGhpcy55U2NhbGUpKTtcclxuXHJcbiAgICBsZXQgdXBkYXRlID0gdGhpcy5jaGFydC5zZWxlY3RBbGwoJy5iYXInKVxyXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpO1xyXG5cclxuICAgIC8vIHJlbW92ZSBleGl0aW5nIGJhcnNcclxuICAgIHVwZGF0ZS5leGl0KCkucmVtb3ZlKCk7XHJcblxyXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIGJhcnNcclxuICAgIHRoaXMuY2hhcnQuc2VsZWN0QWxsKCcuYmFyJykudHJhbnNpdGlvbigpXHJcbiAgICAgIC5hdHRyKCd4JywgZCA9PiB0aGlzLnhTY2FsZShkLmluZGV4KSlcclxuICAgICAgLmF0dHIoJ3knLCBkID0+IHRoaXMueVNjYWxlKGQudmFsdWUpKVxyXG4gICAgICAuYXR0cignd2lkdGgnLCBkID0+IHRoaXMueFNjYWxlLmJhbmR3aWR0aCgpKVxyXG4gICAgICAuYXR0cignaGVpZ2h0JywgZCA9PiB0aGlzLmhlaWdodCAtIHRoaXMueVNjYWxlKGRbMV0pKVxyXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCAnI2JlN2QyNycpO1xyXG5cclxuICAgIC8vIGFkZCBuZXcgYmFyc1xyXG4gICAgdXBkYXRlXHJcbiAgICAgIC5lbnRlcigpXHJcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxyXG4gICAgICAuYXR0cignY2xhc3MnLCAnYmFyJylcclxuICAgICAgLmF0dHIoJ3gnLCBkID0+IHRoaXMueFNjYWxlKGQuaW5kZXgpKVxyXG4gICAgICAuYXR0cigneScsIGQgPT4gdGhpcy55U2NhbGUoZC52YWx1ZSkpXHJcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBkID0+IHRoaXMuaGVpZ2h0IC0gdGhpcy55U2NhbGUoZC52YWx1ZSkpXHJcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMueFNjYWxlLmJhbmR3aWR0aCgpKVxyXG4gICAgICAuc3R5bGUoJ2ZpbGwnLCAnI2JlN2QyNycpXHJcbiAgICAgIC50cmFuc2l0aW9uKClcclxuICAgICAgLmRlbGF5KChkLCBpKSA9PiBpICogMTApXHJcblxyXG4gIH1cclxufVxyXG4iXX0=