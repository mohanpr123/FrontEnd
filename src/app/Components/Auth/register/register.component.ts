import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoSpacesValidatorDirective } from '../../../Services/PublicServices/no-spaces.validator';

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
  registerForm: FormGroup;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required,Validators.minLength(3),
        NoSpacesValidatorDirective.noSpacesValidator()]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]],
      confirmpassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmpassword = group.get('confirmpassword')?.value;
    return password === confirmpassword ? null : { passwordMismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const user = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };
      this.authService.register(user).subscribe({
        next: (createdUser) => {
          this.snackBarService.showMessage('Registration Success', 'OK', 3000);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snackBarService.showMessage('Registration Failed', 'OK', 3000);
          this.message = 'Registration failed. Please try again.';
        }
      });
    } else {
      this.message = 'Please complete the form correctly.';
    }
  }
}
