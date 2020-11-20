import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksEditionComponent } from './tasks-edition.component';

describe('TasksEditionComponent', () => {
  let component: TasksEditionComponent;
  let fixture: ComponentFixture<TasksEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksEditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
