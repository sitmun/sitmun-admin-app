import { OnInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class DatagraphComponent implements OnInit {
    private chartContainer;
    private data;
    private type;
    private margin;
    private margin2;
    private chart;
    private width;
    private height;
    private xScale;
    private yScale;
    private colors;
    private xAxis;
    private yAxis;
    constructor();
    ngOnInit(): void;
    ngOnChanges(): void;
    createBarChart(): void;
    updateBarChart(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<DatagraphComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<DatagraphComponent, "app-datagraph", never, { "data": "data"; "type": "type"; }, {}, never, never>;
}

//# sourceMappingURL=datagraph.component.d.ts.map