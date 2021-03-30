import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksMoreInfoFormComponent } from './tasks-more-info-form.component';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService, TerritoryService, RoleService, TaskGroupService, 
  TaskAvailabilityService, ConnectionService, CodeListService,TranslationService, ResourceService,ExternalService } from 'dist/sitmun-frontend-core/';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';



describe('TasksMoreInfoFormComponent', () => {
  let component: TasksMoreInfoFormComponent;
  let fixture: ComponentFixture<TasksMoreInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksMoreInfoFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule,  RouterTestingModule, MaterialModule, RouterModule],
      providers: [TaskService, TerritoryService, RoleService, CodeListService,TaskGroupService, TaskAvailabilityService, 
        ConnectionService,TranslationService,ResourceService,ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TasksMoreInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
