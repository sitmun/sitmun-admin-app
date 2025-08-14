import { TaskGroup } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Task group manager service */
@Injectable()
export class TaskGroupService extends RestService<TaskGroup> {

  /** constructor */
  constructor(injector: Injector) {
    super(TaskGroup, "task-groups", injector);
  }

}
