import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket = io('http://localhost:5000'); // ✅ connect to backend

  // Listen for new metrics
  onMetric(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('metric:new', (data) => observer.next(data));
    });
  }

  // Listen for new notifications
  onNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('notification:new', (data) => observer.next(data));
    });
  }
}
