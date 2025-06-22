import { TaskType } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** TaskType manager service */
@Injectable()
export class TaskTypeService extends RestService<TaskType> {

  /** constructor */
  constructor(injector: Injector) {
    super(TaskType, "task-types", injector);
  }

}
