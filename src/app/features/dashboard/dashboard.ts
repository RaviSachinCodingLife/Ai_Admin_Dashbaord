import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  chartType: ChartType = 'bar';

  chartData: ChartConfiguration['data'] = {
    labels: ['Users', 'Revenue', 'Active Sessions'],
    datasets: [{ data: [1200, 5400, 300], label: 'Metrics' }],
  };

  explanation = '';

  askAI(metricName: string, value: number) {
    this.explanation = `AI Explanation: ${metricName} is currently at ${value}.`;
  }
}
