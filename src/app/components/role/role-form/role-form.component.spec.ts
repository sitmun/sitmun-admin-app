import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFormComponent } from './role-form.component';
import { RouterModule } from '@angular/router';
import { RoleService, UserService, CodeListService, CartographyGroupService, TerritoryService, 
  CartographyService, TaskService, UserConfigurationService, ApplicationService,ResourceService,ExternalService } from 'dist/sitmun-frontend-core/';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Role } from '@sitmun/frontend-core';
import { Observable } from 'rxjs';


describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFormComponent ],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]),HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [RoleService, UserService, TerritoryService, ApplicationService, CodeListService, 
        CartographyGroupService,UserConfigurationService, CartographyService, TaskService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// describe('RoleService', () => {
//   let service: RoleService;

//   let role: Role =  new Role();;
//   role.id=1;
//   role.name="Name";
//   role.description="Description"; 

//   it('#getObservableValue should return value from observable',
//   (done: DoneFn) => {
//   service.save(role).subscribe(value => {
//     expect(value).toBe(role);
//     done();
//   });
// });
// })