import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksExtractionFmeFormComponent } from './tasks-extraction-fme-form.component';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskService, TerritoryService, RoleService, CartographyService, ServiceService, TaskAvailabilityService, TaskGroupService, CodeListService,TranslationService } from 'dist/sitmun-frontend-core/';
import { MaterialModule } from '../../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TasksExtractionFmeFormComponent', () => {
  let component: TasksExtractionFmeFormComponent;
  let fixture: ComponentFixture<TasksExtractionFmeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksExtractionFmeFormComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, MatIconTestingModule, RouterTestingModule, MaterialModule, RouterModule],
      providers: [TaskService, TerritoryService, RoleService, CodeListService, CartographyService, ServiceService, TaskAvailabilityService, TaskGroupService,TranslationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksExtractionFmeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
