import { TasksDownloadComponent } from './tasks-download.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SitmunFrontendGuiModule } from 'dist/sitmun-frontend-gui/';
import { ExternalConfigurationService } from 'src/app/ExternalConfigurationService';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material-module';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { CodeListService, TaskService } from 'dist/sitmun-frontend-core';
import { HttpClientModule } from '@angular/common/http';


describe('TasksDownloadComponent', () => {
  let component: TasksDownloadComponent;
  let fixture: ComponentFixture<TasksDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDownloadComponent ],
      imports : [HttpClientTestingModule, HttpClientModule, SitmunFrontendGuiModule, RouterTestingModule, MaterialModule, RouterModule, MatIconTestingModule],
      providers: [CodeListService, TaskService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }, ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
