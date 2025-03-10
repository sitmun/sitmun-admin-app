import {Component, OnInit} from '@angular/core';
import {UtilsService} from '@app/services/utils.service';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {config} from '@config';
import {HalOptions, HalParam, Task, TaskService} from '@app/frontend-core/src/lib/public_api';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '@app/frontend-gui/src/lib/public_api';


@Component({
    selector: 'app-tasks-query',
    templateUrl: './tasks-query.component.html',
    styles: []
})
export class TasksQueryComponent implements OnInit {

    dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
    saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
    themeGrid: any = config.agGridTheme;
    columnDefs: any[];
    gridModified = false;

    constructor(private utils: UtilsService,
                private router: Router,
                public taskService: TaskService,
                public dialog: MatDialog,
    ) {
    }


    ngOnInit() {

        const columnEditBtn = this.utils.getEditBtnColumnDef();
        columnEditBtn['cellRendererParams'] = {
            clicked: this.newData.bind(this)
        };

        this.columnDefs = [
            columnEditBtn,
            this.utils.getSelCheckboxColumnDef(),
            this.utils.getIdColumnDef(),
            this.utils.getEditableColumnDef('tasksQueryEntity.task', 'name'),
            this.utils.getNonEditableColumnDef('tasksQueryEntity.informationType', 'groupName'),
            this.utils.getNonEditableColumnDef('tasksQueryEntity.accessType', 'properties.scope'),
        ];
    }

    async canDeactivate(): Promise<boolean | Observable<boolean>> {

        if (this.gridModified) {


            const result = await this.utils.showNavigationOutDialog().toPromise();
            if (!result || result.event !== 'Accept') {
                return false;
            } else if (result.event === 'Accept') {
                return true;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    setGridModifiedValue(value) {
        this.gridModified = value;
    }


    getAllTasksQuery = () => {
        const taskTypeID = config.tasksTypes['query'];
        const params2: HalParam[] = [];
        const param: HalParam = {key: 'type.id', value: taskTypeID};
        params2.push(param);
        const query: HalOptions = {params: params2};
        return this.taskService.getAll(query, undefined, 'tasks');
    };

    removeData(data: []) {

        const dialogRef = this.dialog.open(DialogMessageComponent);
        dialogRef.componentInstance.title = this.utils.getTranslate('caution');
        dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (result.event === 'Accept') {
                    const promises: Promise<any>[] = [];
                    data.forEach(task => {
                        promises.push(new Promise((resolve,) => {
                            this.taskService.delete(task).subscribe(() => {
                                resolve(true);
                            });
                        }));
                        Promise.all(promises).then(() => {
                            this.dataUpdatedEvent.next(true);
                        });
                    });
                }
            }
        });

    }

    newData(id: any) {
        this.saveAgGridStateEvent.next(true);
        this.router.navigate(['taskForm', id, config.tasksTypesNames.query]);

    }


    applyChanges(data: Task[]) {
        const promises: Promise<any>[] = [];
        data.forEach(task => {
            promises.push(new Promise((resolve,) => {
                this.taskService.update(task).subscribe(() => {
                    resolve(true);
                });
            }));
            Promise.all(promises).then(() => {
                this.dataUpdatedEvent.next(true);
            });
        });
    }

    add(event: any[]) {
        // TODO: Implement this method
    }
}
