import { ApplicationParameter } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Application parameter manager service */
@Injectable()
export class ApplicationParameterService extends RestService<ApplicationParameter> {

  /** constructor */
  constructor(injector: Injector) {
    super(ApplicationParameter, "application-parameters", injector);
  }
}
