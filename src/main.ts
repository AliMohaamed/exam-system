import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()), // Add withHashLocation() for better compatibility
    provideHttpClient(),
    ...(appConfig.providers || [])
  ]
})
  .catch((err) => console.error(err));
