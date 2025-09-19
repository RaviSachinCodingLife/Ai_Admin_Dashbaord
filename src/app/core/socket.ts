import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket = io('http://localhost:5000');

  onNewMetric(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('metric:new', (data) => observer.next(data));
    });
  }

  onDeleteMetric(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('metric:delete', (id) => observer.next(id));
    });
  }

  onNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('notification:new', (data) => observer.next(data));
    });
  }
}
