import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexPlotOptions,
  ApexXAxis,
  NgApexchartsModule
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-statsticis',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './statsticis.component.html',
  styleUrls: ['./statsticis.component.css']
})
export class StatsticisComponent implements OnInit {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() color = '#008FFB';
  @Input() icon = '';

  chartOptions!: ChartOptions;

  ngOnInit() {
    this.chartOptions = {
      series: [
        {
          name: '',
          data: [10, 25, 20, 25, 40, 35, 40]
        }
      ],
      chart: {
        type: 'bar',
        height: 100,
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%'
        }
      },
      xaxis: {
        categories: [],
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.4,
          gradientToColors: [this.color],
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.3,
          stops: [0, 100]
        }
      },
      colors: [this.color]
    };
  }

  getDisplayValue(): string {
    if (typeof this.value === 'number') {
      return this.label.toLowerCase().includes('score') ? `${this.value}%` : this.value.toString();
    }
    return this.value.toString();
  }
}
