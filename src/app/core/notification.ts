import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  postNotification(message: string, type: string = 'info') {
    return this.http.post(this.baseUrl, { message, type }, { headers: this.getHeaders() });
  }
}
