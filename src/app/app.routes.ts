import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ReportsComponent } from './features/reports/reports';
import { UsersComponent } from './features/users/users';
import { NotificationsComponent } from './features/notifications/notifications';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
