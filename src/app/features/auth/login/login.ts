import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const { token, role, name, email } = res; 
        const expiresAt = Date.now() + 10 * 60 * 1000; 
        const userData = {
          name: name || this.email.split('@')[0], 
          email: email || this.email,
          role,
          token,
          expiresAt,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        this.router.navigate(['/dashboard']);
        setTimeout(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        }, 10 * 60 * 1000);
      },
      error: (err) => (this.error = err.error.error || 'Login failed'),
    });
  }
}
