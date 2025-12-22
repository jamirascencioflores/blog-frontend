import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// IMPORTS IMPORTANTES:
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { customInterceptor } from './custom.interceptor'; // <--- Tu archivo

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // AGREGA ESTO:
    provideHttpClient(withInterceptors([customInterceptor])),
  ],
};
