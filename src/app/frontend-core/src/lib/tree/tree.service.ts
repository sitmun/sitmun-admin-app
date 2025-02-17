import { Tree } from './tree.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Tree manager service */
@Injectable()
export class TreeService extends RestService<Tree> {
  
  /** API resource path */
  public TREE_API = 'trees';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Tree, "trees", injector);
  }
  
  /** remove tree*/
  remove(item: Tree) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save tree*/
  save(item: Tree): Observable<any> {
    let result: Observable<Object>;
    if (item._links!=null) {
      
      result = this.http.put(item._links.self.href, item);
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.TREE_API) , item);
    }
    return result;
  }
  
}
