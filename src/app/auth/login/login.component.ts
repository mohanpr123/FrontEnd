import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';

// Import Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink
  ],
  template: `<div class="login-container">
  <h2>Login</h2>
  <form (ngSubmit)="onLogin()" class="login-form">
      <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="email" #emailInput="ngModel" id="email" name="email" type="email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$" placeholder="Enter your email" />
          <mat-error *ngIf="emailInput.invalid && emailInput.touched">
              <span *ngIf="emailInput.errors?.['required']">Email is required.</span>
              <span *ngIf="emailInput.errors?.['pattern']">Invalid email format.</span>
          </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput [(ngModel)]="password" #passwordInput="ngModel" id="password" name="password" type="password" required pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$" placeholder="Enter your password" />
          <mat-error *ngIf="passwordInput.invalid && passwordInput.touched">
              <span *ngIf="passwordInput.errors?.['required']">Password is required.</span>
              <span *ngIf="passwordInput.errors?.['pattern']">
                  Password must be at least 6 characters, include letters and numbers.
              </span>
          </mat-error>
      </mat-form-field>

      <!-- Login Button -->
      <button mat-raised-button color="primary" type="submit" class="full-width">
          Login
      </button>
      <br />
      <div *ngIf="message" style="color: red; text-align: center;">
          <span>
              {{message}}
              <button mat-button routerLink="/register">
                  REGISTER
              </button>
          </span>
      </div>
  </form>
</div>

  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      return;
    }

    const user = { email: this.email, password: this.password };
    this.authService.login(user).subscribe({
      next: (response) => {
        // console.log('Response received:', response);
        const token = response?.jwt;
        if (token) {
          this.authService.storeToken(token);
          this.snackBarService.showMessage('Login Success', 'OK', 3000);
          this.message = 'Login Success';
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.snackBarService.showMessage('Login Failed', 'OK', 3000);
        this.message = 'Dont have an account?';
        console.error('Login failed', error);
      },
    });
  }
}
