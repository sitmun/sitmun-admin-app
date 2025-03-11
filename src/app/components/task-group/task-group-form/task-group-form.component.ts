import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TaskGroupService} from '@app/domain';
import { LoggerService } from '@app/services/logger.service';
import {UtilsService} from '@app/services/utils.service';
import {MatTabChangeEvent} from '@angular/material/tabs';

@Component({
  selector: 'app-task-group-form',
  templateUrl: './task-group-form.component.html',
  styles: []
})
export class TaskGroupFormComponent implements OnInit {

  formtaskGroup: UntypedFormGroup;
  taskGroupToEdit;
  taskGroupID = -1;
  duplicateID = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private taskGroupService: TaskGroupService,
    public utils: UtilsService,
    private loggerService: LoggerService
  ) {
    this.initializeTaskGroupForm();
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
        this.taskGroupID = +params.id;
        if (params.idDuplicate) {
          this.duplicateID = +params.idDuplicate;
        }

        if (this.taskGroupID !== -1 || this.duplicateID != -1) {
          const idToGet = this.taskGroupID !== -1 ? this.taskGroupID : this.duplicateID;


          this.taskGroupService.get(idToGet).subscribe(
            resp => {

              this.taskGroupToEdit = resp;
              this.formtaskGroup.setValue({
                id: this.taskGroupID,
                name: this.taskGroupToEdit.name,
                _links: this.taskGroupToEdit._links
              });

              if (this.taskGroupID !== -1) {
                this.formtaskGroup.patchValue({
                  id: this.taskGroupID,
                  name: this.taskGroupToEdit.name,
                });
              } else {
                this.formtaskGroup.patchValue({
                  name: this.utils.getTranslate('copy_').concat(this.taskGroupToEdit.name),
                });
              }


            },
          );
        }

      },
    );
  }


  initializeTaskGroupForm(): void {

    this.formtaskGroup = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, [
        Validators.required,
      ]),
      _links: new UntypedFormControl(null, []),

    })

  }


  onSaveButtonClicked() {

    if (this.formtaskGroup.valid) {

      if (this.taskGroupID == -1 && this.duplicateID != -1) {
        this.formtaskGroup.patchValue({
          _links: null
        });
      }

      this.taskGroupService.save(this.formtaskGroup.value)
        .subscribe(resp => {

            this.taskGroupToEdit = resp;
            this.formtaskGroup.patchValue({
              id: resp.id,
              _links: resp._links
            });
          },
          error => {
            this.loggerService.error('Error saving task group', error);
          });
    } else {
      this.utils.showRequiredFieldsError();
    }

  }

  activeTabIndex = 0;

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }
}
