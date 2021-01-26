import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksThematicComponent } from './tasks-thematic.component';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { CodeListService, TaskService } from '@sitmun/frontend-core';

describe('TasksThematicComponent', () => {
  let component: TasksThematicComponent;
  let fixture: ComponentFixture<TasksThematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksThematicComponent ],
      imports : [HttpClientTestingModule, SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [CodeListService,TaskService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TasksThematicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
