import { Application } from './application.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';
import { CartographyGroup } from '../cartography/cartography-group.model';

/** Application manager service */
@Injectable()
export class ApplicationService extends RestService<Application> {
  

  /** API resource path */
  public APPLICATION_API = 'applications';

  /** constructor */
  constructor(injector: Injector,private http: HttpClient) {
    super(Application, "applications", injector);
  }
  
  /** remove application*/
  remove(item: Application) {
    return this.http.delete(item._links.self.href);
   
  }
  
  /** save application*/
  save(item: Application): Observable<any> {
    let result: Observable<Object>;

    let applicationSituationMap:any = {};
    applicationSituationMap._links= {};
    applicationSituationMap._links.self = {};
    applicationSituationMap._links.self.href="";
     
    if (item.situationMap!=null){
        applicationSituationMap=item.situationMap;
        if (typeof item.situationMap._links!= 'undefined') { 
            item.situationMap = item.situationMap._links.self.href;
        }       
     }

    if (item._links!=null) {
      //update relations
      delete item.situationMap;        
      
      if (applicationSituationMap._links.self.href==''){
         item.deleteRelation('situationMap',applicationSituationMap).subscribe(result => {     
             
             }, error => console.error(error));
          
      } else {
          item.substituteRelation('situationMap',applicationSituationMap).subscribe(result => {
         
      
            }, error => console.error(error));           
       } 
       
         
      result = this.http.put(item._links.self.href, item);

           
    } else {
      result = this.http.post(this.resourceService.getResourceUrl(this.APPLICATION_API) , item);
    }
    return result;
  }
    
    
  
}
