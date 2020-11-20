import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDownloadComponent } from './tasks-download.component';

describe('TasksDownloadComponent', () => {
  let component: TasksDownloadComponent;
  let fixture: ComponentFixture<TasksDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDownloadComponent ]
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
