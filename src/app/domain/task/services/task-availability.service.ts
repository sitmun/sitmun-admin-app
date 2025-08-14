import {Injectable, Injector} from '@angular/core';
import {RestService} from '@app/core/hal/rest/rest.service';
import {TaskAvailability} from '@app/domain';

/** Task availability manager service */
@Injectable()
export class TaskAvailabilityService extends RestService<TaskAvailability> {
  /** constructor */
  constructor(injector: Injector) {
    super(TaskAvailability, "task-availabilities", injector);
  }
}
