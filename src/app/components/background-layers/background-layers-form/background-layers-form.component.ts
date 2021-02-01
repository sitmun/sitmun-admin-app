import { Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackgroundService, HalOptions, HalParam, CartographyGroupService, Background } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';


@Component({
  selector: 'app-background-layers-form',
  templateUrl: './background-layers-form.component.html',
  styleUrls: ['./background-layers-form.component.scss']
})
export class BackgroundLayersFormComponent implements OnInit {

  permissionGroups: Array<any> = [];
  cartographyGroupOfThisLayer;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private backgroundService: BackgroundService,
    private http: HttpClient,
    public utils: UtilsService,
    private cartographyGroupService:CartographyGroupService,
  ) {
    this.initializeBackgroundForm();
  }

  backgroundForm: FormGroup;
  backgroundToEdit;
  backgroundID = -1;

  ngOnInit(): void {

    let permissionGroupByDefault = {
      id: -1,
      name: '-------'
    }
    this.permissionGroups.push(permissionGroupByDefault);

    this.getPermissionGroups().subscribe(
      resp => {
        this.permissionGroups.push(...resp);
      }
    );

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
              cartographyGroup: this.backgroundToEdit.cartographyGroupId,
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

  getPermissionGroups() {
    let params2:HalParam[]=[];
    let param:HalParam={key:'type', value:'F'}
    params2.push(param);
    let query:HalOptions={ params:params2};

    return this.cartographyGroupService.getAll(query);
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

  onSaveButtonClicked(){
    let cartographyGroup= this.permissionGroups.find(x => x.id===this.backgroundForm.value.cartographyGroup )
    if(cartographyGroup==undefined){
      cartographyGroup=""
    }

    var backgroundObj: Background=new Background();
    backgroundObj.name= this.backgroundForm.value.name;
    backgroundObj.description= this.backgroundForm.value.description;
    backgroundObj.cartographyGroup=cartographyGroup
    backgroundObj.active= this.backgroundForm.value.active;
    backgroundObj._links= this.backgroundForm.value._links;

    this.backgroundService.save(backgroundObj)
      .subscribe(resp => {
        console.log(resp);
        this.backgroundToEdit=resp;
        this.backgroundID=resp.id;
        this.backgroundForm.patchValue({
          id: resp.id,
          _links: resp._links
        })
      },
      error=>{
        console.log("error")
      });
    }

}
