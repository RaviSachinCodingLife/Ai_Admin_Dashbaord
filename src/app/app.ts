import { Component, signal } from '@angular/core';
import { AppLayoutComponent } from './layout/app-layout/app-layout';

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ai-admin-dashboard');
}
