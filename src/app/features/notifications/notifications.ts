import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification';
import { SocketService } from '../../core/socket';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  newMessage: string = '';
  newType: string = 'info';

  constructor(private notificationService: NotificationService, private socket: SocketService) {}

  ngOnInit() {
    // Fetch existing notifications
    this.notificationService.getNotifications().subscribe((res) => {
      this.notifications = res;
    });

    // Listen for new notifications via Socket.IO
    this.socket.onNotification().subscribe((note) => {
      this.notifications.unshift(note);
    });
  }

  sendNotification() {
    if (!this.newMessage) return;
    this.notificationService.postNotification(this.newMessage, this.newType).subscribe((res) => {
      this.newMessage = '';
      this.newType = 'info';
    });
  }

  isAdminOrManager(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;
    const role = JSON.parse(user).role;
    return role === 'admin' || role === 'manager';
  }
}
