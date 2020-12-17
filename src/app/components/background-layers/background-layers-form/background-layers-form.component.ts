import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackgroundService } from 'dist/sitmun-frontend-core/';
import { Connection } from 'dist/sitmun-frontend-core/connection/connection.model';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { BtnEditRenderedComponent } from 'dist/sitmun-frontend-gui/';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-background-layers-form',
  templateUrl: './background-layers-form.component.html',
  styleUrls: ['./background-layers-form.component.scss']
})
export class BackgroundLayersFormComponent implements OnInit {

  cartographyGroups: Array<any> = [];
  cartographyGroupOfThisLayer;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private backgroundService: BackgroundService,
    private http: HttpClient,
    private utils: UtilsService,
  ) {
    this.initializeBackgroundForm();
  }


  backgroundForm: FormGroup;
  backgroundToEdit;
  backgroundID = -1;




  ngOnInit(): void {

    // let cartographyGroupByDefault = {
    //   id: -1,
    //   name: 'Selecciona el grup del territory'
    // }
    // this.cartographyGroups.push(cartographyGroupByDefault);
    // this.cartographyGroupOfThisLayer = cartographyGroupByDefault;
    // console.log(this.cartographyGroupOfThisLayer);
    // this.cartographyGroupService.getAll()
    // .pipe(map(data => data[`_embedded`][`backgroundMaps`]))
    // .subscribe(
    //   resp => {
    //     console.log(resp);
    //     this.cartographyGroups.push(...resp);
    //   }
    // );




    this.activatedRoute.params.subscribe(params => {
      this.backgroundID = +params.id;
      if (this.backgroundID !== -1) {
        console.log(this.backgroundID);

        this.backgroundService.get(this.backgroundID).subscribe(
          resp => {
            console.log(resp);
            this.backgroundToEdit = resp;
            this.backgroundForm.setValue({
              id: this.backgroundID,
              name: this.backgroundToEdit.name,
              description: this.backgroundToEdit.description,
              cartographyGroup: this.backgroundToEdit.cartographyGroup.name,
              active: this.backgroundToEdit.active,
              _links: this.backgroundToEdit._links
            });


          },
          error => {
 
          }
        );
      }
      else {
        this.backgroundForm.patchValue({
          active: false,
        });
      }

    },
      error => {

      });


  }


  initializeBackgroundForm(): void {

    this.backgroundForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [
        Validators.required,
      ]),
      description: new FormControl(null, [
        Validators.required,
      ]),
      cartographyGroup: new FormControl(null, [
        Validators.required,
      ]),
      active: new FormControl(null, [
        Validators.required,
      ]),
      _links: new FormControl(null, []),

    });

  }

  addNewBackground() {
    console.log(this.backgroundForm.value);
    this.backgroundService.create(this.backgroundForm.value)
      .subscribe(resp => {
        console.log(resp);
        // this.router.navigate(["/company", resp.id, "formConnection"]);
      });
  }

  updateBackground() {

    console.log(this.backgroundForm.value);

    this.backgroundService.update(this.backgroundForm.value)
      .subscribe(resp => {
        console.log(resp);

      });

  }
}
