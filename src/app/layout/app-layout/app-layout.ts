import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class AppLayoutComponent {
  username: string = 'Guest';
  showDropdown = false;

  constructor() {
    const storedUser = localStorage.getItem('user');
    this.username = storedUser ? JSON.parse(storedUser).name : 'Guest';
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    localStorage.clear();
    location.href = '/login';
  }

  isAdmin(): boolean {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return false;
    return JSON.parse(storedUser).role === 'admin';
  }
}
