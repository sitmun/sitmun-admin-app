import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import * as echarts from 'echarts';
import {EChartsOption} from 'echarts';

/** `note` replaces the `series: value` tooltip line for that point. */
export type DataPoint = { index: string; value: number | null; note?: string };
export type DataSeries = { name: string; data: DataPoint[]; color?: string; kind?: 'bar' | 'line' | 'scatter' };

@Component({
    selector: 'app-datagraph',
    templateUrl: './datagraph.component.html',
    styleUrls: ['./datagraph.component.scss'],
    standalone: false
})
export class DatagraphComponent implements OnInit, OnChanges {

  @Input() data: Array<DataPoint> = [];
  @Input() type: 'bar' | 'area' | 'line' = 'bar';
  @Input() cumulative = false;
  @Input() series?: DataSeries[];
  @Input() axis?: 'category' | 'time';
  @Input() labels?: 'all' | 'auto';
  @Input() stacked = false;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() height = 400;
  @Input() reference: {value: number} | null = null;
  @Input() totalLabel: string | null = null;
  @Input() dateLocale: string | null = null;
  @Input() datePeriod: 'day' | 'month' = 'day';

  chartOption: EChartsOption = {};
  loading = true;

  ngOnInit(): void {
    this.updateChartOptions();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateChartOptions();
  }

  private updateChartOptions(): void {
    const hasSeries = this.series?.some((item) => item.data.length > 0) ?? false;
    if ((!this.data || this.data.length === 0) && !hasSeries) {
      this.loading = false;
      return;
    }

    if (this.usesExtension()) {
      this.chartOption = this.createExtendedOptions();
      this.loading = false;
      return;
    }

    const xAxisData = this.data.map(d => d.index);
    const seriesData = this.data.map(d => d.value ?? 0);

    this.chartOption = this.lineChart()
      ? this.createAreaChartOptions(xAxisData, seriesData)
      : this.createBarChartOptions(xAxisData, seriesData);
    this.loading = false;
  }

  private lineChart(): boolean {
    return this.type === 'area' || this.type === 'line';
  }

  private usesExtension(): boolean {
    return this.series != null
      || this.axis != null
      || this.labels != null
      || this.stacked
      || this.reference != null
      || this.orientation === 'horizontal';
  }

  private createExtendedOptions(): EChartsOption {
    const palette = ['#FF9300', '#c62828', '#009688', '#1565c0'];
    const series = this.series ?? [{
      name: '',
      data: this.data,
      kind: this.lineChart() ? 'line' as const : 'bar' as const,
    }];
    const axis = this.axis ?? (this.lineChart() ? 'time' : 'category');
    const labels = this.labels ?? (this.type === 'bar' && axis === 'category' ? 'all' : 'auto');
    const horizontal = this.orientation === 'horizontal';
    const categories = series[0]?.data.map(point => point.index) ?? [];
    const categoryAxis = {
      type: 'category' as const,
      data: categories,
      axisLabel: {
        rotate: horizontal ? 0 : 45,
        fontSize: 10,
        color: '#666',
        interval: labels === 'all' ? 0 : 'auto',
      },
    };
    const valueAxis = {type: 'value' as const, axisLabel: {fontSize: 10, color: '#666'}};
    const timeAxis = {type: 'time' as const, axisLabel: {rotate: 45, fontSize: 10, color: '#666'}};
    const xAxis = horizontal ? valueAxis : axis === 'time' ? timeAxis : categoryAxis;
    const yAxis = horizontal ? categoryAxis : valueAxis;
    const noted = series.some(item => item.data.some(point => point.note != null));
    return {
      backgroundColor: 'transparent',
      tooltip: this.totalLabel != null
        ? {trigger: 'axis', formatter: (params: unknown) => this.totalTooltip(params, this.totalLabel ?? '')}
        : noted
          ? {trigger: 'axis', formatter: (params: unknown) => this.noteTooltip(params)}
          : {trigger: 'axis'},
      legend: series.length > 1 ? {data: series.map(item => item.name)} : undefined,
      grid: {left: '5%', right: '5%', bottom: '20%', top: '10%', containLabel: true},
      xAxis,
      yAxis,
      series: series.map((item, index) => {
        const color = item.color ?? palette[index % palette.length];
        const kind = item.kind ?? (this.lineChart() ? 'line' : 'bar');
        const points = item.data.map(point => {
          const value = axis === 'time' && !horizontal ? [point.index, point.value] : point.value;
          return point.note == null ? value : {value, name: point.note};
        });
        if (kind === 'scatter') {
          // A line point is a 4 px emptyCircle with a 2 px stroke, so a filled 6 px circle reads as the same dot.
          return {name: item.name, type: 'scatter' as const, data: points, symbol: 'circle', symbolSize: 6, itemStyle: {color}};
        }
        return {
          name: item.name,
          type: kind,
          data: points,
          stack: this.stacked ? 'total' : undefined,
          connectNulls: false,
          itemStyle: {color},
          areaStyle: kind === 'line' && this.type === 'area' ? {color} : undefined,
          markLine: index === 0 && this.reference ? {
            symbol: 'none',
            label: {show: false},
            emphasis: {label: {show: false}},
            data: [{
              yAxis: this.reference.value,
              lineStyle: {type: 'dashed' as const, color: '#c62828'},
            }],
          } : undefined,
        };
      }),
    };
  }

  private totalTooltip(params: unknown, totalLabel: string): string {
    const items = (Array.isArray(params) ? params : [params]) as Array<{
      axisValue?: unknown; axisValueLabel?: string; marker?: string; seriesName?: string; value: unknown;
    }>;
    const valueOf = (item: {value: unknown}): number | null => {
      const value = Array.isArray(item.value) ? item.value[1] : item.value;
      return typeof value === 'number' ? value : null;
    };
    const total = items.reduce((sum, item) => sum + (valueOf(item) ?? 0), 0);
    const axisValue = items[0]?.axisValue;
    const header = this.dateLocale != null && typeof axisValue === 'number'
      ? new Intl.DateTimeFormat(this.dateLocale, this.dateFormat()).format(axisValue)
      : items[0]?.axisValueLabel ?? '';
    return [
      header,
      ...items.map(item => `${item.marker ?? ''}${item.seriesName ?? ''}: ${valueOf(item) ?? '-'}`),
      `${totalLabel}: ${total}`,
    ].join('<br/>');
  }

  private noteTooltip(params: unknown): string {
    const items = (Array.isArray(params) ? params : [params]) as Array<{
      axisValueLabel?: string; marker?: string; seriesName?: string; name?: string; value: unknown;
    }>;
    const lines = items.flatMap(item => {
      const value = Array.isArray(item.value) ? item.value[1] : item.value;
      if (typeof value !== 'number') {
        return [];
      }
      return [`${item.marker ?? ''}${item.name || `${item.seriesName ?? ''}: ${value}`}`];
    });
    return [items[0]?.axisValueLabel ?? '', ...lines].join('<br/>');
  }

  private dateFormat(): Intl.DateTimeFormatOptions {
    switch (this.datePeriod) {
      case 'day':
        return {dateStyle: 'medium'};
      case 'month':
        return {year: 'numeric', month: 'long'};
      default: {
        const unreachable: never = this.datePeriod;
        return unreachable;
      }
    }
  }

  private createAreaChartOptions(
    xData: string[], 
    yData: number[]
  ): EChartsOption {
    let values = yData;
    if (this.cumulative) {
      values = [];
      let sum = 0;
      for (const val of yData) {
        sum += val;
        values.push(sum);
      }
    }
    
    const timeSeriesData = xData.map((date, index) => ({
      value: [date, values[index]]
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#FF9300',
            width: 2
          }
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.value[0]}<br/>${param.value[1]}`;
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#FF9300',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '20%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'time',  // Time-based axis for accurate spacing
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          color: '#666',
          formatter: '{yyyy}-{MM}-{dd}'
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eee',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10,
          color: '#666'
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#eee',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'line',
          data: timeSeriesData,
          smooth: this.cumulative,  // Smooth cumulative charts for better flow
          symbol: 'circle',
          symbolSize: this.cumulative ? 4 : 6,
          itemStyle: {
            color: '#FF9300'
          },
          lineStyle: {
            width: this.cumulative ? 3 : 2,
            color: '#FF9300'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: 'rgba(255, 147, 0, 0.4)' },
                { offset: 1, color: 'rgba(255, 147, 0, 0.05)' }
              ]
            )
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: '#FF9300',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(255, 147, 0, 0.5)'
            }
          },
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        }
      ]
    };
  }

  private createBarChartOptions(
    xData: string[], 
    yData: number[]
  ): EChartsOption {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}<br/>{c}',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#FF9300',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '20%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          color: '#666',
          interval: 0
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10,
          color: '#666'
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#eee',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'bar',
          data: yData,
          barWidth: '60%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: '#FF9300' },
                { offset: 1, color: '#FFB84D' }
              ]
            ),
            borderRadius: [8, 8, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#FF9300',
              shadowBlur: 10,
              shadowColor: 'rgba(255, 147, 0, 0.5)'
            }
          },
          label: {
            show: true,
            position: 'top',
            color: '#333',
            fontSize: 10,
            fontWeight: 'bold'
          },
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        }
      ]
    };
  }
}
