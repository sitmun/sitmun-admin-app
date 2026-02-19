import { Injectable } from '@angular/core';

import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams
} from '@ngx-translate/core';

import { MissingTranslationTrackerService } from '@app/services/missing-translation-tracker.service';
import { environment } from '@environments/environment';

/**
 * Logs missing translation keys and records them for the dev "Missing Translations" panel.
 * Only records when not in production.
 */
@Injectable()
export class AppMissingTranslationHandler implements MissingTranslationHandler {
  constructor(private readonly tracker: MissingTranslationTrackerService) {}

  handle(params: MissingTranslationHandlerParams): string {
    if (!environment.production) {
      // Defer so we don't emit from inside a computed/template (NG0600: writing to signals in computed).
      queueMicrotask(() => this.tracker.addKey(params.key));
    }
    return params.key;
  }
}
