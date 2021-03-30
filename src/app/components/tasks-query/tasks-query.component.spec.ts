import { TasksQueryComponent } from './tasks-query.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { CodeListService, TaskService,TranslationService } from 'dist/sitmun-frontend-core/';

describe('TasksQueryComponent', () => {
  let component: TasksQueryComponent;
  let fixture: ComponentFixture<TasksQueryComponent>;
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksQueryComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [CodeListService, TaskService,TranslationService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TasksQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
