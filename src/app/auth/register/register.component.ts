import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
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
  template: `
   <div class="register-container">
    <h2>Register</h2>
    <form (ngSubmit)="onRegister()" class="register-form">
        <!-- Username -->
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username" name="username" required />
        </mat-form-field>

        <!-- Email -->
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" #emailInput="ngModel" name="email" type="email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" />
            <mat-error *ngIf="emailInput.invalid && emailInput.touched">
                <span *ngIf="emailInput.errors?.['required']">
                    Email is required.
                </span>
                <span *ngIf="emailInput.errors?.['pattern']">
                    Invalid email format.
                </span>
            </mat-error>
        </mat-form-field>

        <!-- Password -->
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [(ngModel)]="password" #passwordInput="ngModel" name="password" type="password" required pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$" />
            <mat-error *ngIf="passwordInput.invalid && passwordInput.touched">
                <span *ngIf="passwordInput.errors?.['required']">
                    Password is required.
                </span>
                <span *ngIf="passwordInput.errors?.['pattern']">
                    Password is too weak.
                </span>
            </mat-error>
        </mat-form-field>

        <!-- Confirm Password -->
        <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput [(ngModel)]="confirmpassword" (ngModelChange)="checkPasswords()" name="confirmPassword" type="password" required />
            <mat-error *ngIf="passwordMismatch">
                Passwords do not match.
            </mat-error>
        </mat-form-field>

        <!-- Register Button -->
        <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="passwordMismatch || !username || !email || !password">
            Register
        </button>
        <div class="finalMessage">
            <span *ngIf="message">
                {{ message }}
                <button mat-button routerLink="/login">Login</button>
            </span>
        </div>
    </form>
</div>

  `,
  styleUrls: ['./register.component.css'],
})


export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmpassword: string = '';
  passwordMismatch: boolean = false;
  message: string = '';
  id: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  checkPasswords() {
    this.passwordMismatch = this.confirmpassword !== this.password;
  }

  onRegister() {
    if (!this.username || !this.email || !this.password || this.passwordMismatch) {
      this.message = 'Please complete the form correctly.';
      return;
    }

    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.register(user).subscribe({
      next: (createdUser) => {
        this.id = createdUser?.id;
        console.log('Registration successful for user:', createdUser.username, this.id);
        this.snackBarService.showMessage('Registration Success', 'OK', 3000);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.message = error.error || 'Registration failed. Please try again.';
        this.snackBarService.showMessage('Registration Failed', 'OK', 3000);
        console.error('Error response:', error);
      },
    });
  }
}
