import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskGroupService, UserService,Connection } from '@sitmun/frontend-core';

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
      if (this.taskGroupID !== -1) {
        console.log(this.taskGroupID);

        this.taskGroupService.get(this.taskGroupID).subscribe(
          resp => {
            console.log(resp);
            this.taskGroupToEdit = resp;
            this.formtaskGroup.setValue({
              id: this.taskGroupID,
              name: this.taskGroupToEdit.name,
              _links: this.taskGroupToEdit._links
            });


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

    this.taskGroupService.create(this.formtaskGroup.value)
      .subscribe(resp => {
        console.log(resp); 
        this.taskGroupToEdit=resp;
      },
      error => {
        console.log(error);
      });


  }


}
