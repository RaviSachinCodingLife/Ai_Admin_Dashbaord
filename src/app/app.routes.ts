import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ReportsComponent } from './features/reports/reports';
import { UsersComponent } from './features/users/users';
import { NotificationComponent } from './features/notifications/notifications';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { PublicGuard } from './core/public-guard-guard';
import { AuthGuard } from './core/auth-guard';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { AdminGuard } from './core/admin-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [PublicGuard] },

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'notifications', component: NotificationComponent },
      { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
