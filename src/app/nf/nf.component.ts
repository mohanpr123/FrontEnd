import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-nf',
  imports: [MatIcon],
  template: `<div class="container">
    <p>404 PAGE NOT FOUND <mat-icon [inline]="true">highlight_off</mat-icon></p>

    <!-- <img
      src="https://img.freepik.com/free-vector/404-error-abstract-concept-illustration_335657-2243.jpg"
      alt="not found"
    /> -->
  </div>`,
  styleUrl: './nf.component.css',
})
export class NfComponent {}
