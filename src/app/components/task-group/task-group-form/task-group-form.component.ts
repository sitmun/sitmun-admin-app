import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskGroupService, UserService,Connection } from '../../../frontend-core/src/lib/public_api';

import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-task-group-form',
  templateUrl: './task-group-form.component.html',
  styleUrls: ['./task-group-form.component.scss']
})
export class TaskGroupFormComponent implements OnInit {

  formtaskGroup: FormGroup;
  taskGroupToEdit;
  taskGroupID: number = -1;
  duplicateID = -1;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private taskGroupService: TaskGroupService,
    private http: HttpClient,
    public utils: UtilsService,
  ) {
    this.initializeTaskGroupForm();
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.taskGroupID = +params.id;
      if(params.idDuplicate) { this.duplicateID = +params.idDuplicate; }
      
      if (this.taskGroupID !== -1 || this.duplicateID != -1) {
        let idToGet = this.taskGroupID !== -1? this.taskGroupID: this.duplicateID  
        console.log(this.taskGroupID);

        this.taskGroupService.get(idToGet).subscribe(
          resp => {
            console.log(resp);
            this.taskGroupToEdit = resp;
            this.formtaskGroup.setValue({
              id: this.taskGroupID,
              name: this.taskGroupToEdit.name,
              _links: this.taskGroupToEdit._links
            });

            if(this.taskGroupID !== -1){
              this.formtaskGroup.patchValue({
                id: this.taskGroupID,
                name: this.taskGroupToEdit.name,
              });
            }
            else{
              this.formtaskGroup.patchValue({
                name: this.utils.getTranslate('copy_').concat(this.taskGroupToEdit.name),
              });
            }


          },
          error => {

          }
        );
      }

    },
      error => {

      });
  }



  initializeTaskGroupForm(): void {

    this.formtaskGroup = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    })

  }



  onSaveButtonClicked(){

    if(this.formtaskGroup.valid)
    {

      if (this.taskGroupID == -1 && this.duplicateID != -1) {
        this.formtaskGroup.patchValue({
          _links: null
        })
      }

        this.taskGroupService.save(this.formtaskGroup.value)
          .subscribe(resp => {
            console.log(resp); 
            this.taskGroupToEdit=resp;
            this.formtaskGroup.patchValue({
              id: resp.id,
              _links: resp._links
            })
          },
          error => {
            console.log(error);
          });
    }
    else{
      this.utils.showRequiredFieldsError();
    }

  }


}
