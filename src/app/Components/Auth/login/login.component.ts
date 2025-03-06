import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { LoginForm } from '../../../types/form.type';
import { MESSAGE, ROUTES } from '../../../Constants/app.constants';
import { User } from '../../../types/user.type';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: LoginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid)
      return;

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    } as User;
    this.authService
      .login(data)
      .pipe(
        tap(response => {
          this.authService.storeToken(response.jwt);
          this.authService.storeUsername(response.username);
          this.snackBarService.showMessage(MESSAGE.LOGINOK);
          this.router.navigate([ROUTES.PRODUCTS]);
        }),
        catchError(() => {
          this.snackBarService.showMessage(MESSAGE.LOGINFAILED);
          return of();
        })
      )
      .subscribe();
  }
}
