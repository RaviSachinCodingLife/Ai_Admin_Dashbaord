import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { SocketService } from '../../core/socket';

interface Metric {
  _id: string;
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, HttpClientModule, NgChartsModule, FormsModule],
})
export class DashboardComponent implements OnInit {
  role = '';
  metrics: Metric[] = [];
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  pieChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  explanation = '';
  prediction = '';
  selectedMetric: Metric | null = null;

  newMetric: Partial<Metric> = { name: '', value: 0 };

  constructor(private http: HttpClient, private auth: AuthService, private socket: SocketService) {}

  ngOnInit() {
    this.role = this.auth.getRole() || 'viewer';
    this.fetchMetrics();

    this.socket.onNewMetric().subscribe((metric) => {
      this.metrics.push(metric);
      this.updateCharts();
    });

    this.socket.onDeleteMetric().subscribe((id: string) => {
      this.metrics = this.metrics.filter((m) => m._id !== id);
      this.updateCharts();
    });

    this.socket.onNotification().subscribe((note) => {
      alert(`🔔 ${note.message}`);
    });
  }

  fetchMetrics() {
    this.http
      .get<Metric[]>('http://localhost:5000/api/metrics', {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      })
      .subscribe({
        next: (res) => {
          this.metrics = res;
          this.updateCharts();
        },
        error: (err) => console.error(err),
      });
  }

  updateCharts() {
    const labels = this.metrics.map((m) => m.name);
    const values = this.metrics.map((m) => m.value);

    this.chartData = {
      labels,
      datasets: [{ data: [...values], label: 'Metrics (Bar)' }],
    };

    this.lineChartData = {
      labels,
      datasets: [{ data: [...values], label: 'Metrics Trend', fill: true }],
    };

    this.pieChartData = {
      labels,
      datasets: [{ data: [...values], label: 'Metrics Distribution' }],
    };
  }

  addMetric() {
    if (!this.newMetric.name || !this.newMetric.value) return;

    this.http
      .post<Metric>('http://localhost:5000/api/metrics', this.newMetric, {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      })
      .subscribe({
        next: (res) => {
          // Instead of pushing, replace metrics array with a new one
          this.metrics = [...this.metrics.filter((m) => m._id !== res._id), res];
          this.updateCharts();
          this.newMetric = { name: '', value: 0 };
        },
        error: (err) => console.error(err),
      });
  }

  deleteMetric(id: string) {
    this.http
      .delete(`http://localhost:5000/api/metrics/${id}`, {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      })
      .subscribe({
        next: () => {
          this.metrics = this.metrics.filter((m) => m._id !== id);
          this.updateCharts();
        },
        error: (err) => console.error(err),
      });
  }

  askAI(metric: Metric) {
    this.selectedMetric = metric;
    this.explanation = 'Loading AI explanation...';

    this.http
      .post<any>(
        'http://localhost:5000/api/metrics/explain',
        { metricName: metric.name, value: metric.value },
        { headers: { Authorization: `Bearer ${this.auth.getToken()}` } }
      )
      .subscribe({
        next: (res) => (this.explanation = res.explanation),
        error: () => (this.explanation = 'AI explanation failed'),
      });
  }

  predictAI() {
    this.prediction = 'Loading prediction...';

    this.http
      .post<any>(
        'http://localhost:5000/api/metrics/predict',
        {},
        { headers: { Authorization: `Bearer ${this.auth.getToken()}` } }
      )
      .subscribe({
        next: (res) => (this.prediction = res.prediction),
        error: () => (this.prediction = 'Prediction failed'),
      });
  }

  exportCSV() {
    const rows = [['Name', 'Value'], ...this.metrics.map((m) => [m.name, m.value.toString()])];

    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'metrics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
