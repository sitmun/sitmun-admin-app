import { TaskAvailability } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

/** Task availability manager service */
@Injectable()
export class TaskAvailabilityService extends RestService<TaskAvailability> {


  /** API resource path */
  public TASK_AVAILABILITY_API = 'task-availabilities';

  /** constructor */
  constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
    super(TaskAvailability, "task-availabilities", injector);
  }

  /** save task availability*/
  save(item: TaskAvailability): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
      if (item.task !=null){
          item.substituteRelation('task',item.task).subscribe(result => {

      }, error => this.loggerService.error('Error substituting task relation:', error));
      }
      if (item.territory !=null){
          item.substituteRelation('territory',item.territory).subscribe(result => {

      }, error => this.loggerService.error('Error substituting territory relation:', error));
      }
    } else {
      item.territory = item.territory._links.self.href;
      item.task = item.task._links.self.href;

      result = this.http.post(this.resourceService.getResourceUrl(this.TASK_AVAILABILITY_API) , item);
    }
    return result;
  }

}
