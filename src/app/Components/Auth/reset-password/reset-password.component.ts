import { Component } from '@angular/core';
import { AuthService } from '../../../Services/Auth/auth.service';
import { FormGroup, Validators,FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { resetPassword } from '../../../Models/ResetPassword.model';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';


@Component({
  selector: 'app-reset-password',
  imports: [MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule,MatSnackBarModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  resetForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService,private router: Router,
    private snackBar: SnackbarService, private fb : FormBuilder)
    {
      this.resetForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        Password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }

   OnReset():void{
    if(this.resetForm.valid)
    {
      const request:resetPassword = {
        email : this.resetForm.value.email,
        password : this.resetForm.value.Password
      };
    this.authService.resetPassword(request).subscribe(
    {
      next: () => {
        this.snackBar.showMessage('Password reset successful', 'OK', 3000);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Password reset failed. Please check your details.';
        this.snackBar.showMessage(this.errorMessage, 'OK', 3000);
      }
    });
    }
   }
}
