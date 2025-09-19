import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AppLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ai-admin-dashboard');
  username: string = 'Guest';
  showDropdown = false;

  constructor(private router: Router) {
    this.updateUserFromLocalStorage();
  }

  updateUserFromLocalStorage() {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');

    if (!token || !expiry || new Date() > new Date(expiry)) {
      this.logout();
    } else {
      const storedUser = localStorage.getItem('user');
      this.username = storedUser ? JSON.parse(storedUser).name : 'Guest';
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    localStorage.clear();
    this.username = 'Guest';
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    return !!token && !!expiry && new Date() <= new Date(expiry);
  }
}
