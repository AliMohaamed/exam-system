import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center mt-5">
      <h1 class="display-1">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead mb-4">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
    </div>
  `,
  styles: [`
    .container {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class PageNotFoundComponent {} 