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
import { tap, catchError, of } from 'rxjs';
import { RegisterForm, User } from '../../../types/app.type';
import { NoSpacesValidatorDirective } from '../../../Services/PublicServices/no-spaces.validator';
import { ValidationErrors, AbstractControl } from '@angular/forms';
import { MESSAGE, ROUTES } from '../../../Constants/app.constants';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: RegisterForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) {
    this.registerForm = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.minLength(3), NoSpacesValidatorDirective.noSpacesValidator()]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]],
      confirmpassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmpassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  onRegister(): void {
    if (this.registerForm.invalid) return;

    const DATA = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    }as User;

    this.authService
      .register(DATA)
      .pipe(
        tap(() => {
          this.snackBarService.showMessage(MESSAGE.REGISTEROK);
          this.router.navigate([ROUTES.LOGIN]);
        }),
        catchError(() => {
          this.snackBarService.showMessage(MESSAGE.BADRESPONSE);
          return of();
        })
      )
      .subscribe();
  }
}
