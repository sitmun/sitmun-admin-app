import { Injectable, Injector } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { RestService } from '@app/core/hal/rest/rest.service';
import { LoggerService } from '@app/services/logger.service';

import { Task } from '../models/task.model';
/** Task manager service */
@Injectable()
export class TaskService extends RestService<Task> {

    /** API resource path */
    public CONNECTION_API = 'tasks';

    /** constructor */
    constructor(injector: Injector, private loggerService: LoggerService) {
        super(Task, "tasks", injector);
    }

    /** save task*/
    save(item: Task): Observable<any> {
        this.loggerService.debug("Save task:", item);
        if (!ResourceHelper.canBeUpdated(item)) {
            return this.create(item);
        }

        const relationOps = [
            this.applyRelation(item, 'service', item.service),
            this.applyRelation(item, 'cartography', item.cartography),
            this.applyRelation(item, 'connection', item.connection),
            this.applyUiRelation(item),
            this.applyGroupRelation(item),
            this.applyTypeRelation(item),
            this.applyRolesRelation(item)
        ];

        return forkJoin(relationOps).pipe(
            switchMap(() => this.update(item))
        );
    }

    private applyRelation(
        item: Task,
        relation: string,
        resource?: any
    ): Observable<unknown> {
        if (!resource) {
            return item.updateRelationEx(relation, null);
        }
        return item.substituteRelation(relation, resource);
    }

    private applyUiRelation(item: Task): Observable<unknown> {
        if (!item.ui) {
            return of(null);
        }
        const uiHref = ResourceHelper.getSelfHref(item.ui);
        this.loggerService.debug("Save task: UI link", uiHref);
        return item.substituteRelation('ui', item.ui);
    }

    private applyGroupRelation(item: Task): Observable<unknown> {
        if (!item.group) {
            return of(null);
        }
        return item.substituteRelationById(
            'group',
            'task-groups',
            item.group
        );
    }

    private applyTypeRelation(item: Task): Observable<unknown> {
        if (!item.type) {
            return of(null);
        }
        return item.substituteRelationById(
            'type',
            'task-types',
            item.type
        );
    }

    private applyRolesRelation(item: Task): Observable<unknown> {
        if (!item.roles) {
            return of(null);
        }
        const roles = [...item.roles];
        delete item.roles;
        return item.substituteAllRelation('roles', roles);
    }
}
