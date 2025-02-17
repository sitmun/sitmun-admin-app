import { TaskUI } from './task-ui.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Task UI manager service */
@Injectable()
export class TaskUIService extends RestService<TaskUI> {
  

  /** API resource path */
  public CONNECTION_API = 'task-uis';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(TaskUI, "task-uis", injector);
  }
  
  /** remove task UI*/
  remove(item: TaskUI) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save task UI*/
  save(item: TaskUI): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {      
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API) , item);
    }
    return result;
  }
  
}
