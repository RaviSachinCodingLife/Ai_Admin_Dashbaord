import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, LoginComponent],
})
export class AuthModule {}
