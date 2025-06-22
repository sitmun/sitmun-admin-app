import {Application} from '@app/domain';
import {Injectable, Injector} from '@angular/core';
import {RestService} from '@app/core/hal/rest/rest.service';

/** Application manager service */
@Injectable()
export class ApplicationService extends RestService<Application> {

  /** constructor */
  constructor(injector: Injector) {
    super(Application, "applications", injector);
  }
}
