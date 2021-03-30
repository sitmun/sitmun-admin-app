import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksReportFormComponent } from './tasks-report-form.component';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService, TerritoryService,  RoleService, TaskGroupService,  TaskAvailabilityService, CodeListService,TranslationService } from 'dist/sitmun-frontend-core/';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';


describe('TasksReportFormComponent', () => {
  let component: TasksReportFormComponent;
  let fixture: ComponentFixture<TasksReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksReportFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [TaskService, TerritoryService, RoleService, CodeListService, TaskGroupService, TaskAvailabilityService,TranslationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
