import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  notifications: string[] = [
    'User Alice logged in.',
    'New metric added: Revenue.',
    'System update scheduled at 12:00 PM.',
  ];
}
