import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-2uer6jn7.us.auth0.com',
      clientId: 'vPrRYMapHctnHElKEcjSR388bLGL0h0m',
      authorizationParams: {
        redirect_uri: window.location.origin + '/login',
      },
      cacheLocation: 'memory'
    }),
    importProvidersFrom([HttpClientModule, BrowserAnimationsModule])
  ]
};
