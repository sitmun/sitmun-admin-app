import { Task } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';
/** Task manager service */
@Injectable()
export class TaskService extends RestService<Task> {

    /** API resource path */
    public CONNECTION_API = 'tasks';

    /** constructor */
    constructor(injector: Injector, private http: HttpClient, private loggerService: LoggerService) {
        super(Task, "tasks", injector);
    }

    /** save task*/
    save(item: Task): Observable<any> {
        this.loggerService.debug("Save task:", item);
        let result: Observable<Object>;

        if (item._links != null) {

            if (!item.service) {
                let service: any = {}
                service._links = {};
                service._links.self = {};
                service._links.self.href = "";
                item.deleteRelation('service', service).subscribe(result => {
                }, error => this.loggerService.error('Error deleting service relation:', error));
            } else {
                item.service._links.self.href = item.service._links.self.href.split("{")[0]
                item.substituteRelation('service', item.service).subscribe(result => {
                }, error => this.loggerService.error('Error substituting service relation:', error));
                item.service = item.service._links.self.href
            }
            if (!item.cartography) {
                let cartography: any = {}
                cartography._links = {};
                cartography._links.self = {};
                cartography._links.self.href = "";
                item.deleteRelation('cartography', cartography).subscribe(result => {
                }, error => this.loggerService.error('Error deleting cartography relation:', error));
            } else {
                item.cartography._links.self.href = item.cartography._links.self.href.split("{")[0]
                item.substituteRelation('cartography', item.cartography).subscribe(result => {
                }, error => this.loggerService.error('Error substituting cartography relation:', error));
                item.cartography = item.cartography._links.self.href
            }

            if (!item.connection) {
                let connection: any = {}
                connection._links = {};
                connection._links.self = {};
                connection._links.self.href = "";
                item.deleteRelation('connection', connection).subscribe(result => {
                }, error => this.loggerService.error('Error deleting connection relation:', error));
            } else {
                item.connection._links.self.href = item.connection._links.self.href.split("{")[0]
                item.substituteRelation('connection', item.connection).subscribe(result => {
                }, error => this.loggerService.error('Error substituting connection relation:', error));
                item.connection = item.connection._links.self.href
            }

            if (!item.ui) {
                // item.deleteRelation('ui', item.ui).subscribe(result => {
                // }, error => this.loggerService.error('Error deleting UI relation:', error));
            } else {
                item.ui._links.self.href = item.ui._links.self.href.split("{")[0]
                this.loggerService.debug("Save task: UI link", item.ui._links.self.href);
                item.substituteRelation('ui', item.ui).subscribe(result => {
                }, error => this.loggerService.error('Error substituting UI relation:', error));
                item.ui = item.ui._links.self.href
            }

            if (!item.group) {
                // item.deleteRelation('group', item.group).subscribe(result => {
                // }, error => this.loggerService.error('Error deleting group relation:', error));
            } else {
                item.substituteRelationById('group', 'task-groups', item.group).subscribe({
                    next: result => {},
                    error: error => this.loggerService.error('Error substituting group relation by ID:', error)
                });
            }

            if (!item.type) {
                    // item.deleteRelation('type', item.type).subscribe(result => {
                    // }, error => this.loggerService.error('Error deleting type relation:', error));
                } else {
                    item.substituteRelationById('type', 'task-types', item.type).subscribe({
                        next: result => {},
                        error: error => this.loggerService.error('Error substituting type relation by ID:', error)
                    });
                }

                if (item.roles) {
                    let roles = [...item.roles];
                    delete item.roles;
                    item.substituteAllRelation('roles', roles).subscribe(result => {
                    }, error => this.loggerService.error('Error substituting all roles relation:', error));
                }

                result = this.http.put(item._links.self.href, item);
            } else {
                result = this.http.post(this.resourceService.getResourceUrl(this.CONNECTION_API), item);
            }
            return result;
        }

    }
