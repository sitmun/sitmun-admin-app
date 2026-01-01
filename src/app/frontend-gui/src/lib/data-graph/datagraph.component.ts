import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as echarts from 'echarts';
import {EChartsOption} from 'echarts';

type DataPoint = { index: string; value: number };

/**
 * Chart component using Apache ECharts for modern, 
 * interactive data visualization
 */
@Component({
  selector: 'app-datagraph',
  templateUrl: './datagraph.component.html',
  styleUrls: ['./datagraph.component.scss']
})
export class DatagraphComponent implements OnInit, OnChanges {

  @Input() data: Array<DataPoint> = [];
  @Input() type: 'bar' | 'area' = 'bar';
  @Input() cumulative: boolean = false; // For accumulated charts

  chartOption: EChartsOption = {};
  loading = true;

  ngOnInit(): void {
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChartOptions();
    }
  }

  /**
   * Update ECharts configuration with current data
   */
  private updateChartOptions(): void {
    if (!this.data || this.data.length === 0) {
      this.loading = false;
      return;
    }

    const xAxisData = this.data.map(d => d.index);
    const seriesData = this.data.map(d => d.value);

    this.chartOption = this.type === 'area' 
      ? this.createAreaChartOptions(xAxisData, seriesData)
      : this.createBarChartOptions(xAxisData, seriesData);
    this.loading = false;
  }

  /**
   * Create area chart configuration for time-series data
   * Uses time-based x-axis for accurate temporal visualization
   */
  private createAreaChartOptions(
    xData: string[], 
    yData: number[]
  ): EChartsOption {
    // Calculate cumulative values if needed
    let values = yData;
    if (this.cumulative) {
      values = [];
      let sum = 0;
      for (const val of yData) {
        sum += val;
        values.push(sum);
      }
    }
    
    // Convert date strings to timestamps for proper time-based axis
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

  /**
   * Create bar chart configuration with Material Design styling
   */
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
