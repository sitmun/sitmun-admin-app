import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { TaskGroup } from '../models/task-group.model';

/** Task group manager service */
@Injectable()
export class TaskGroupService extends RestService<TaskGroup> {

  /** constructor */
  constructor(injector: Injector) {
    super(TaskGroup, "task-groups", injector);
  }

}
