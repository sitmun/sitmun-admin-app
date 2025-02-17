import { Task } from './task.model';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from '../angular-hal/src/lib/rest.service';

/** Task manager service */
@Injectable()
export class TaskService extends RestService<Task> {

    /** API resource path */
    public CONNECTION_API = 'tasks';

    /** constructor */
    constructor(injector: Injector, private http: HttpClient) {
        super(Task, "tasks", injector);
    }

    /** remove task*/
    remove(item: Task) {
        return this.http.delete(item._links.self.href);
    }
    
    /** save task*/
    save(item: Task): Observable<any> {
        let result: Observable<Object>;

        if (item._links != null) {

            if (!item.service) {
                let service:any = {}
                service._links = {};
                service._links.self = {};
                service._links.self.href = "";
                item.deleteRelation('service', service).subscribe(result => {
                }, error => console.error(error)); 
            }else {
                item.service._links.self.href=item.service._links.self.href.split("{")[0]
                item.substituteRelation('service', item.service).subscribe(result => {
                }, error => console.error(error));
                item.service = item.service._links.self.href
            }
            if (!item.cartography) {
                let cartography:any = {}
                cartography._links = {};
                cartography._links.self = {};
                cartography._links.self.href = "";
                item.deleteRelation('cartography', cartography).subscribe(result => {
                }, error => console.error(error)); 
            }else {
                item.cartography._links.self.href=item.cartography._links.self.href.split("{")[0]
                item.substituteRelation('cartography', item.cartography).subscribe(result => {
                }, error => console.error(error));
                item.cartography = item.cartography._links.self.href
            }

            if (!item.connection) {
                let connection:any = {}
                connection._links = {};
                connection._links.self = {};
                connection._links.self.href = "";
                item.deleteRelation('connection', connection).subscribe(result => {
                }, error => console.error(error)); 
            }else {
                item.connection._links.self.href=item.connection._links.self.href.split("{")[0]
                item.substituteRelation('connection', item.connection).subscribe(result => {
                }, error => console.error(error));
                item.connection = item.connection._links.self.href
            }

            if (!item.ui) {
                // item.deleteRelation('ui', item.ui).subscribe(result => {
                // }, error => console.error(error)); 
            }else {
                item.ui._links.self.href=item.ui._links.self.href.split("{")[0]
                item.substituteRelation('ui', item.ui).subscribe(result => {
                }, error => console.error(error));
                item.ui = item.ui._links.self.href
            }

            if (!item.group) {
                // item.deleteRelation('group', item.group).subscribe(result => {
                // }, error => console.error(error)); 
            }else {
                item.group._links.self.href=item.group._links.self.href.split("{")[0]
                item.substituteRelation('group', item.group).subscribe(result => {
                }, error => console.error(error));
                item.group = item.group._links.self.href
            }

            if (!item.type) {
                // item.deleteRelation('type', item.type).subscribe(result => {
                // }, error => console.error(error)); 
            }else {
                item.type._links.self.href=item.type._links.self.href.split("{")[0]
                item.substituteRelation('type', item.type).subscribe(result => {
                }, error => console.error(error));
                item.type = item.type._links.self.href
            }

            if(item.roles){
                let roles = [...item.roles];
                delete item.roles;
                item.substituteAllRelation('roles',roles).subscribe(result => {
                }, error => console.error(error));
            }

            result = this.http.put(item._links.self.href, item);            
        } else {
            if(item.cartography){
                item.cartography = item.cartography._links.self.href
            }
            if(item.connection){
                item.connection = item.connection._links.self.href
            }
            if(item.service){
                item.service = item.service._links.self.href
            }
            if(item.ui){
                item.ui = item.ui._links.self.href
            }
            if(item.group){
                item.group = item.group._links.self.href
            }
            if(item.type){
                item.type = item.type._links.self.href
            }
            result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
        }
        return result;
    }

}
