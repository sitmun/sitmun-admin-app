import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    console.error('Error starting application:', err);
    // TODO: Improve error handling for Production environment
    // In a production environment, you might want to show a user-friendly error message
    // or redirect to an error page instead of just logging to console
  });
