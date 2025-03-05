import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/Auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentRoute(): string {
    return this.router.url;
  }

  get isLoginRoute(): boolean {
    return this.currentRoute === '/login';
  }

  get isRegisterRoute(): boolean {
    return this.currentRoute === '/register';
  }

  get isProductsRoute(): boolean {
    return this.currentRoute === '/products';
  }

  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  getUsername(): string {
    return this.authService.getUsername();
  }
}
