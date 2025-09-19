import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  role: 'viewer' | 'manager' | 'admin';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  users: User[] = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'manager' },
    { id: 3, name: 'Charlie', role: 'viewer' },
  ];

  newUser: Partial<User> = { name: '', role: 'viewer' };

  addUser() {
    if (!this.newUser.name) return;
    const id = this.users.length + 1;
    this.users.push({ id, name: this.newUser.name!, role: this.newUser.role as any });
    this.newUser = { name: '', role: 'viewer' };
  }

  deleteUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
