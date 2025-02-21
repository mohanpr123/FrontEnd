import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { SnackbarService } from '../../snackbar.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatButton],
  template: `
    <p>Hey buddy , heres my Small GIFT 🎁!!!</p>
    <div class="container">
      <button
        mat-raised-button
        color="primary"
        type="submit"
        class="full-width"
        (click)="onLogout()"
      >
        Log-out
      </button>
    </div>
    <br />
    <img [src]="image" alt="This is random image" />
  `,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router , private authService: AuthService,private snackBar : SnackbarService) {}

  image = 'https://wallpapercave.com/wp/wp7640378.jpg';

  onLogout() {
    this.authService.clearToken();
    this.snackBar.showMessage("Log Out Success",'OK',3000)
    this.router.navigate(['/login']);
  }
}
