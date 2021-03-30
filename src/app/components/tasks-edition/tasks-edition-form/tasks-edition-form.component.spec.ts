import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksEditionFormComponent } from './tasks-edition-form.component';import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService, TerritoryService, TaskAvailabilityService, TaskGroupService, RoleService, CodeListService,ServiceService,TranslationService } from 'dist/sitmun-frontend-core/';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TasksEditionFormComponent', () => {
  let component: TasksEditionFormComponent;
  let fixture: ComponentFixture<TasksEditionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksEditionFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [TaskService, TerritoryService, TaskGroupService, RoleService, CodeListService, TaskAvailabilityService,ServiceService,TranslationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TasksEditionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
