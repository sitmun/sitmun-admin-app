import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { TaskType } from '../models/task-type.model';

/** TaskType manager service */
@Injectable()
export class TaskTypeService extends RestService<TaskType> {

  /** constructor */
  constructor(injector: Injector) {
    super(TaskType, "task-types", injector);
  }

}
