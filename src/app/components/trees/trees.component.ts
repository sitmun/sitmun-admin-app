import {Component, OnInit} from '@angular/core';
import {TreeService, Tree} from '../../frontend-core/src/lib/public_api';
import {UtilsService} from '../../services/utils.service';
import {Router} from '@angular/router';
import {Observable, Subject, firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogMessageComponent} from '../../frontend-gui/src/lib/public_api';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styles: []
})
export class TreesComponent implements OnInit {
  saveAgGridStateEvent: Subject<boolean> = new Subject<boolean>();
  dataUpdatedEvent: Subject<boolean> = new Subject<boolean>();
  columnDefs: any[];
  gridModified = false;

  constructor(
    public dialog: MatDialog,
    public treeService: TreeService,
    private utils: UtilsService,
    private router: Router,
  ) {}

  ngOnInit() {
    const columnEditBtn = this.utils.getEditBtnColumnDef();
    columnEditBtn['cellRendererParams'] = {
      clicked: this.newData.bind(this)
    };

    this.columnDefs = [
      columnEditBtn,
      this.utils.getSelCheckboxColumnDef(),
      this.utils.getIdColumnDef(),
      this.utils.getEditableColumnDef('treesEntity.name', 'name')
    ];
  }

  async canDeactivate(): Promise<boolean> {
    if (!this.gridModified) {
      return true;
    }

    const result = await firstValueFrom(this.utils.showNavigationOutDialog());
    return !result || result.event === 'Accept';
  }

  setGridModifiedValue(value: boolean): void {
    this.gridModified = value;
  }

  getAllTrees = (): Observable<Tree[]> => {
    return this.treeService.getAll();
  };

  async newData(id: any): Promise<void> {
    this.saveAgGridStateEvent.next(true);
    await this.router.navigate(['trees', id, 'treesForm']);
  }

  async applyChanges(data: Tree[]): Promise<void> {
    const promises: Promise<any>[] = [];

    data.forEach(tree => {
      promises.push(new Promise((resolve) => {
        this.treeService.update(tree).subscribe(() => {
          resolve(true);
        });
      }));
    });

    await Promise.all(promises);
    this.dataUpdatedEvent.next(true);
  }

  async add(data: Tree[]): Promise<void> {
    await this.router.navigate(['trees', -1, 'treesForm', data[0].id]);
  }

  removeData(data: Tree[]): void {
    const dialogRef = this.dialog.open(DialogMessageComponent);
    dialogRef.componentInstance.title = this.utils.getTranslate('caution');
    dialogRef.componentInstance.message = this.utils.getTranslate('removeMessage');

    dialogRef.afterClosed().subscribe(async result => {
      if (result && result.event === 'Accept') {
        const promises: Promise<any>[] = [];

        data.forEach(tree => {
          promises.push(new Promise((resolve) => {
            this.treeService.delete(tree).subscribe(() => {
              resolve(true);
            });
          }));
        });

        await Promise.all(promises);
        this.dataUpdatedEvent.next(true);
      }
    });
  }
}
