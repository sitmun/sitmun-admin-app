import { TaskUI } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Task UI manager service */
@Injectable()
export class TaskUIService extends RestService<TaskUI> {

  /** constructor */
  constructor(injector: Injector) {
    super(TaskUI, "task-uis", injector);
  }

}
