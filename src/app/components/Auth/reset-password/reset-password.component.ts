import { Component } from '@angular/core';
import { AuthService } from '../../../Services/Auth/auth.service';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { resetPassword } from '../../../types/user.type';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { MESSAGE, ROUTES } from '../../../constants/app.constants';


@Component({
  selector: 'app-reset-password',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  resetForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router,
    private snackBar: SnackbarService, private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]]
    });
  }

  onReset(): void {
    if (this.resetForm.valid) {
      const request: resetPassword = {
        email: this.resetForm.value.email,
        password: this.resetForm.value.Password
      };
      this.authService.resetPassword(request).subscribe(
        {
          next: () => {
            this.snackBar.showMessage(MESSAGE.RESETOK);
            this.router.navigate([ROUTES.LOGIN]);
          },
          error: (error) => {
            console.log(error);
            this.snackBar.showMessage(MESSAGE.BADRESPONSE);
          }
        });
    }
  }
}
