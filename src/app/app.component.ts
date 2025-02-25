import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './Services/Auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  template: `
    <mat-toolbar color="primary" *ngIf="!isLoggedIn || isProductsRoute">
      <span class="title">ANGULAR-APP</span>
      <span class="spacer"></span>
      <nav *ngIf="!isLoggedIn">
        <button mat-button routerLink="/login">
          <mat-icon>login</mat-icon>
          LOGIN
        </button>
        <button mat-button routerLink="/register">
          <mat-icon>person_add</mat-icon>
          REGISTER
        </button>
      </nav>
      <button mat-button (click)="logout()" *ngIf="isLoggedIn && isProductsRoute">
        <mat-icon>logout</mat-icon>
        LOGOUT
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn: boolean = false;
  isProductsRoute: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Check initial login status
    this.isLoggedIn = this.authService.isLoggedIn();

    // Subscribe to auth changes
    this.authService.userLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    // Track current route for /products
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isProductsRoute = event.url === '/products';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
