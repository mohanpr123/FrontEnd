import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../../Services/PublicServices/snackbar.service';
import { UploadService } from '../../../Services/PublicServices/upload.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatToolbar,MatIcon,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  imageUrl:string="";
  username:string="";
  showLogout!:boolean;

  constructor(private authService: AuthService, private router: Router,
    private snackbarService:SnackbarService,private uploadservice:UploadService) {}

  ngOnInit(): void {
      this.username=this.authService.getUsername();
      this.loadProfileImage();
  }

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

  toggleLogout(): void {
    this.showLogout = !this.showLogout;
  }

  logout(): void {
    this.showLogout = false;
    this.authService.logout();
  }

  getUsername(): string {
    return this.authService.getUsername();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadservice.uploadProfileImage(file).subscribe();
      setTimeout(()=>{
        this.loadProfileImage()
        this.snackbarService.showMessage("Profile photo set!")
      },1000)
    }
  }

  loadProfileImage(): void {
    this.uploadservice.getProfileImage().pipe(
      tap((url)=>{
        this.imageUrl=url;
      })
    ).subscribe()
  }
}
