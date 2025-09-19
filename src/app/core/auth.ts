import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'token';
  private roleKey = 'role';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.roleKey, res.role);
      })
    );
  }

  register(name: string, email: string, password: string, role: string = 'viewer') {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, role });
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  logout() {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry && new Date() > new Date(expiry)) {
      this.logout();
      return false;
    }
    return true;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    // Set token expiry 10 minutes from now
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    localStorage.setItem('tokenExpiry', expiry.toISOString());
  }
}
