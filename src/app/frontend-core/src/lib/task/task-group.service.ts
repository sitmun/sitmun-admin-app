import { TaskGroup } from './task-group.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Task group manager service */
@Injectable()
export class TaskGroupService extends RestService<TaskGroup> {
  

  /** API resource path */
  public CONNECTION_API = 'task-groups';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(TaskGroup, "task-groups", injector);
  }
  
  /** remove task group*/
  remove(item: TaskGroup) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save task group*/
  save(item: TaskGroup): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) , item);
    }
    return result;
  }
  
}
