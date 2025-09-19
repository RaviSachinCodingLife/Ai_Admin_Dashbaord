import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

interface User {
  _id: string;
  name: string;
  role: 'viewer' | 'manager' | 'admin';
  email?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  newUser: Partial<User> = { name: '', role: 'viewer' };
  token: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.token = JSON.parse(storedUser).token;
      this.fetchUsers();
    }
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }

  fetchUsers() {
    if (!this.token) return;
    this.http.get<User[]>('http://localhost:5000/api/users', this.getAuthHeaders()).subscribe({
      next: (res) => (this.users = res),
      error: (err) => console.error('Failed to fetch users', err),
    });
  }

  addUser() {
    if (!this.newUser.name || !this.token) return;

    this.http
      .post<User>('http://localhost:5000/api/users', this.newUser, this.getAuthHeaders())
      .subscribe({
        next: (res) => {
          this.users.push(res);
          this.newUser = { name: '', role: 'viewer' };
        },
        error: (err) => console.error(err),
      });
  }

  deleteUser(id: string) {
    if (!this.token) return;

    this.http.delete(`http://localhost:5000/api/users/${id}`, this.getAuthHeaders()).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u._id !== id);
      },
      error: (err) => console.error(err),
    });
  }
}
