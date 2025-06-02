import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()), // Add withHashLocation() for better compatibility
    provideHttpClient(),
    ...(appConfig.providers || [])
  ]
})
  .catch((err) => console.error(err));
