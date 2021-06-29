import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleComponent } from './role.component';
import { RoleService, UserConfigurationService, CodeListService,TranslationService,ResourceService,ExternalService } from 'dist/sitmun-frontend-core/';
import { HttpClientModule } from '@angular/common/http';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Role } from '@sitmun/frontend-core';

describe('RoleComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [RoleService,CodeListService,UserConfigurationService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // let role:Role = new Application();
  // let spy: any;
  // role.name="Nom";
  // role.id = 1;
  // role.description = "Description"
  

  // it('should update', () => {
  //   spy=component.applyChanges([role])
  // })
});
