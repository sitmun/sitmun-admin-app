import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxEchartsModule } from 'ngx-echarts';

import { DatagraphComponent } from './datagraph.component';

// Polyfill for ResizeObserver in test environment
class ResizeObserver {
   
  observe() {}
   
  unobserve() {}
   
  disconnect() {}
}

describe('DatagraphComponent', () => {
  let component: DatagraphComponent;
  let fixture: ComponentFixture<DatagraphComponent>;

  beforeAll(() => {
    // Add ResizeObserver polyfill to global scope
    if (typeof global.ResizeObserver === 'undefined') {
      (global as any).ResizeObserver = ResizeObserver;
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatagraphComponent ],
      imports: [
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts')
        })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps a category axis and a label on every bar', () => {
    component.type = 'bar';
    component.data = [{index: 'A', value: 2}, {index: 'B', value: 0}];
    component.ngOnChanges({});
    const axis = component.chartOption.xAxis as {type: string; axisLabel: {interval: number}};
    expect(axis.type).toBe('category');
    expect(axis.axisLabel.interval).toBe(0);
  });

  it('keeps a time axis for an area chart', () => {
    component.type = 'area';
    component.data = [{index: '2026-10-01', value: 1}];
    component.ngOnChanges({});
    const axis = component.chartOption.xAxis as {type: string};
    expect(axis.type).toBe('time');
  });

  it('stacks series, leaves a null gap, and can turn the bar horizontal', () => {
    component.series = [
      {name: 'ok', data: [{index: '2026-10-01', value: 3}, {index: '2026-10-02', value: null}], kind: 'bar', color: '#FF9300'},
      {name: 'failed', data: [{index: '2026-10-01', value: 1}, {index: '2026-10-02', value: 2}], kind: 'bar', color: '#c62828'},
    ];
    component.axis = 'time';
    component.stacked = true;
    component.labels = 'auto';
    component.ngOnChanges({});
    const series = component.chartOption.series as Array<{stack?: string; data: unknown[]}>;
    expect(series).toHaveLength(2);
    expect(series[0].stack).toBe('total');
    expect(series[0].data[1]).toEqual(['2026-10-02', null]);

    component.orientation = 'horizontal';
    component.axis = 'category';
    component.ngOnChanges({});
    const yAxis = component.chartOption.yAxis as {type: string};
    expect(yAxis.type).toBe('category');
  });

  it('adds the stack total to the axis tooltip', () => {
    component.series = [
      {name: 'ok', data: [{index: '2026-10-06', value: 98}], kind: 'bar'},
      {name: 'failed', data: [{index: '2026-10-06', value: 31}], kind: 'bar'},
    ];
    component.axis = 'time';
    component.stacked = true;
    component.totalLabel = 'Total';
    component.ngOnChanges({});
    const tooltip = component.chartOption.tooltip as {formatter: (params: unknown) => string};
    const html = tooltip.formatter([
      {axisValueLabel: '2026-10-06', marker: '', seriesName: 'ok', value: ['2026-10-06', 98]},
      {axisValueLabel: '2026-10-06', marker: '', seriesName: 'failed', value: ['2026-10-06', 31]},
    ]);
    expect(html.split('<br/>')).toEqual(['2026-10-06', 'ok: 98', 'failed: 31', 'Total: 129']);
  });

  it('shows the day without midnight time when a date locale is set', () => {
    component.series = [{name: 'ok', data: [{index: '2026-10-06', value: 98}], kind: 'bar'}];
    component.axis = 'time';
    component.totalLabel = 'Total';
    component.dateLocale = 'en';
    component.ngOnChanges({});
    const tooltip = component.chartOption.tooltip as {formatter: (params: unknown) => string};
    const day = new Date(2026, 9, 6).getTime();
    const html = tooltip.formatter([
      {axisValue: day, axisValueLabel: '2026-10-06 00:00:00', marker: '', seriesName: 'ok', value: [day, 98]},
    ]);
    expect(html.split('<br/>')[0]).toBe('Oct 6, 2026');
  });

  it('names the month, not its first day, for monthly buckets', () => {
    component.series = [{name: 'ok', data: [{index: '2026-10', value: 98}], kind: 'bar'}];
    component.axis = 'time';
    component.totalLabel = 'Total';
    component.dateLocale = 'en';
    component.datePeriod = 'month';
    component.ngOnChanges({});
    const tooltip = component.chartOption.tooltip as {formatter: (params: unknown) => string};
    const month = new Date(2026, 9, 1).getTime();
    const html = tooltip.formatter([
      {axisValue: month, axisValueLabel: '2026-10-01 00:00:00', marker: '', seriesName: 'ok', value: [month, 98]},
    ]);
    expect(html.split('<br/>')[0]).toBe('October 2026');
  });

  it('draws a reference limit as a dashed red line without a numeric label', () => {
    component.series = [{
      name: 'Backend',
      kind: 'line',
      data: [{index: '2026-10-06T10:00:00', value: 120}],
    }];
    component.axis = 'time';
    component.type = 'line';
    component.reference = {value: 10000};
    component.ngOnChanges({});

    const series = component.chartOption.series as Array<{markLine?: {
      label?: {show?: boolean; formatter?: unknown};
      emphasis?: {label?: {show?: boolean}};
      data: Array<{
        yAxis?: number;
        name?: string;
        label?: {show?: boolean; formatter?: unknown};
        lineStyle?: {type?: string; color?: string};
      }>;
    }}>;
    const markLine = series[0].markLine;
    const line = markLine?.data[0];
    expect(line?.yAxis).toBe(10000);
    expect(line?.lineStyle).toEqual({type: 'dashed', color: '#c62828'});
    expect(markLine?.label?.show).toBe(false);
    expect(markLine?.emphasis?.label?.show).toBe(false);
    expect(line?.name).toBeUndefined();
    expect(line?.label).toBeUndefined();
    expect(markLine?.label?.formatter).toBeUndefined();

    const yAxis = component.chartOption.yAxis as {name?: string};
    expect(yAxis.name).toBeUndefined();
    expect(component.chartOption.graphic).toBeUndefined();
  });

  it('breaks the line at a null and draws marker points that explain themselves in the tooltip', () => {
    component.series = [
      {
        name: 'Backend',
        kind: 'line',
        data: [
          {index: '2026-10-06T10:00:00', value: 120},
          {index: '2026-10-06T10:10:00', value: null},
        ],
      },
      {
        name: 'Timed out',
        kind: 'scatter',
        color: '#c62828',
        data: [{index: '2026-10-06T10:10:00', value: 10000, note: 'Timed out · 10:10 · Backend'}],
      },
    ];
    component.axis = 'time';
    component.type = 'line';
    component.ngOnChanges({});

    const series = component.chartOption.series as Array<{
      type: string; data: unknown[]; connectNulls?: boolean; symbol?: string; symbolSize?: number; itemStyle?: {color?: string};
    }>;
    expect(series[0].type).toBe('line');
    expect(series[0].connectNulls).toBe(false);
    expect(series[0].data).toEqual([['2026-10-06T10:00:00', 120], ['2026-10-06T10:10:00', null]]);
    expect(series[1].type).toBe('scatter');
    expect(series[1].symbol).toBe('circle');
    expect(series[1].symbolSize).toBe(6);
    expect(series[1].itemStyle?.color).toBe('#c62828');
    expect(series[1].data).toEqual([
      {value: ['2026-10-06T10:10:00', 10000], name: 'Timed out · 10:10 · Backend'},
    ]);

    const tooltip = component.chartOption.tooltip as {formatter: (params: unknown) => string};
    const html = tooltip.formatter([
      {axisValueLabel: '10:10', marker: '', seriesName: 'Backend', value: ['2026-10-06T10:10:00', null]},
      {
        axisValueLabel: '10:10', marker: '', seriesName: 'Timed out',
        value: ['2026-10-06T10:10:00', 10000], name: 'Timed out · 10:10 · Backend',
      },
    ]);
    expect(html.split('<br/>')).toEqual(['10:10', 'Timed out · 10:10 · Backend']);
  });

  it('keeps the default axis tooltip when no series carries notes', () => {
    component.series = [{name: 'Backend', kind: 'line', data: [{index: '2026-10-06T10:00:00', value: 120}]}];
    component.axis = 'time';
    component.type = 'line';
    component.ngOnChanges({});

    expect(component.chartOption.tooltip).toEqual({trigger: 'axis'});
  });
});
