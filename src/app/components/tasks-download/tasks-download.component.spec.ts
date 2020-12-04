import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDownloadComponent } from './tasks-download.component';
import { RouterModule } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TasksDownloadComponent', () => {
  let component: TasksDownloadComponent;
  let fixture: ComponentFixture<TasksDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDownloadComponent ],
      imports: [ RouterModule, MatIconTestingModule]
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
