import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { AuthService } from '../../core/auth';

interface Metric {
  _id: string;
  name: string;
  value: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  metrics: Metric[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.fetchMetrics();
  }

  fetchMetrics() {
    this.http
      .get<Metric[]>('http://localhost:5000/api/metrics', {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      })
      .subscribe({
        next: (res) => (this.metrics = res),
        error: (err) => console.error(err),
      });
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('📑 Analytics Report', 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value']],
      body: this.metrics.map((m) => [m.name, m.value.toString()]),
    });

    doc.save('analytics-report.pdf');
  }

  exportCSV() {
    const rows = [['Metric', 'Value'], ...this.metrics.map((m) => [m.name, m.value.toString()])];
    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, 'analytics-report.csv');
  }
}
