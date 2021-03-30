import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksQueryFormComponent } from './tasks-query-form.component';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService, TerritoryService,  RoleService, TaskGroupService, ConnectionService, 
  TaskAvailabilityService, CodeListService,TranslationService,ResourceService,ExternalService } from 'dist/sitmun-frontend-core/';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TasksQueryFormComponent', () => {
  let component: TasksQueryFormComponent;
  let fixture: ComponentFixture<TasksQueryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksQueryFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [TaskService, TerritoryService, RoleService, CodeListService, TaskGroupService, ConnectionService, 
         TaskAvailabilityService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TasksQueryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

