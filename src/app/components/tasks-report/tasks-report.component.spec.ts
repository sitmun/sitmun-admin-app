import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksReportComponent } from './tasks-report.component';
import { RouterModule } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TasksReportComponent', () => {
  let component: TasksReportComponent;
  let fixture: ComponentFixture<TasksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksReportComponent ],
      imports: [ RouterModule, MatIconTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
