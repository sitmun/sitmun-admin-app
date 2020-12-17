import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskGroupService, UserService, } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';

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
    private utils: UtilsService,
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

  // addNewTaskGroup() {
  //   console.log(this.formRole.value);
  //   this.taskGroupService.create(this.formRole.value)
  //     .subscribe(resp => {
  //       console.log(resp);
  //      
  //     });


  // }

  // updateTaskGroup() {

  //   console.log(this.formRole.value);

  //   this.taskGroupService.update(this.formRole.value)
  //     .subscribe(resp => {
  //       console.log(resp);

  //     });

  // }

}
