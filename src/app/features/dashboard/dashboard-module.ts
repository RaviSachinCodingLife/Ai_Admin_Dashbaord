import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard';

@NgModule({
  imports: [
    CommonModule,
    NgChartsModule, // ✅ import the module, not BaseChartDirective
    DashboardComponent,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
