import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { ServiceService,TerritoryService, TaskTypeService, CartographyService, ConnectionService,CodeListService,ResourceService,ExternalService,TaskService,TaskUIService,RoleService,TaskGroupService } from 'dist/sitmun-frontend-core/';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';


describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule,MaterialModule, MatIconTestingModule, RouterModule],
      providers: [ServiceService, TerritoryService, CodeListService,TaskTypeService,CartographyService,ResourceService,ExternalService,ConnectionService,TaskService,TaskUIService,RoleService,TaskGroupService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
