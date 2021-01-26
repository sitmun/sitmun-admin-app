import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFormComponent } from './role-form.component';
import { RouterModule } from '@angular/router';
import { RoleService, UserService, CodeListService, CartographyGroupService, TerritoryService, CartographyService, TaskService, UserConfigurationService, ApplicationService } from '@sitmun/frontend-core';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';


describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFormComponent ],
      imports: [HttpClientTestingModule, RouterModule.forRoot([]),HttpClientModule,
      SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [RoleService, UserService, TerritoryService, ApplicationService, CodeListService, CartographyGroupService,UserConfigurationService, CartographyService, TaskService,
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
