import { Background } from './background.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Background manager service */
@Injectable()
export class BackgroundService extends RestService<Background> {

  /** API resource path */
  public BACKGROUND_API = 'backgrounds';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Background, "backgrounds", injector);
  }
  
  /** remove background*/
  remove(item: Background) {
    return this.http.delete(item._links.self.href);   
  }
  
  /** save background*/
  save(item: Background): Observable<any> {
    let result: Observable<Object>;
    let backgroundCartographyGroup:any = {}         
    
    backgroundCartographyGroup._links= {};
    backgroundCartographyGroup._links.self = {};
    backgroundCartographyGroup._links.self.href="";
    item.cartographyGroup;

    if (item.cartographyGroup!=null){
      backgroundCartographyGroup = item.cartographyGroup;
        if (typeof item.cartographyGroup._links!= 'undefined') { 
            item.cartographyGroup = item.cartographyGroup._links.self.href;
        }    
     }

    if (item._links!=null) {
      //update relations
      delete item.cartographyGroup;        
      
      if (backgroundCartographyGroup._links.self.href==''){
         item.deleteRelation('cartographyGroup',backgroundCartographyGroup).subscribe(result => {     

          
             }, error => console.error(error));
          
      } else {
          item.substituteRelation('cartographyGroup',backgroundCartographyGroup).subscribe(result => {
         

      
            }, error => console.error(error));           
       } 
       
         
      result = this.http.put(item._links.self.href, item);

           
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.BACKGROUND_API) , item);
    }
    return result;
  }
  
}
