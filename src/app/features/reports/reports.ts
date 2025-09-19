import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  exportPDF() {
    alert('Export to PDF feature will be added here.');
  }

  exportCSV() {
    alert('Export to CSV feature will be added here.');
  }
}
