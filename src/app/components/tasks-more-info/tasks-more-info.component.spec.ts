import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksMoreInfoComponent } from './tasks-more-info.component';

describe('TasksMoreInfoComponent', () => {
  let component: TasksMoreInfoComponent;
  let fixture: ComponentFixture<TasksMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksMoreInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
