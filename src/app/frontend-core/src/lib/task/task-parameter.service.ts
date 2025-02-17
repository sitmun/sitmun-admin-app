import { TaskParameter } from './task-parameter.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Task parameter manager service */
@Injectable() 
export class TaskParameterService extends RestService<TaskParameter> {
  

  /** API resource path */
  public TASK_PARAMETER_API = 'task-parameters';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(TaskParameter, "task-parameters", injector);
  }
  
  /** remove task parameter*/
  remove(item: TaskParameter) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save task parameter*/
  save(item: TaskParameter): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      result = this.http.put(item._links.self.href, item);
      if (item.task !=null){
          item.substituteRelation('task',item.task).subscribe(result => {
      
      }, error => console.error(error));
      }
      
    } else {
      item.task = item.task._links.self.href;
  
      result = this.http.post(this.resourceService.getResourceUrl(this.TASK_PARAMETER_API) , item);
    }
    return result;
  }
  
}
