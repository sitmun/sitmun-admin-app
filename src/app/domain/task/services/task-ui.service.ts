import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { TaskUI } from '../models/task-ui.model';

/** Task UI manager service */
@Injectable()
export class TaskUIService extends RestService<TaskUI> {

  /** constructor */
  constructor(injector: Injector) {
    super(TaskUI, "task-uis", injector);
  }

}
