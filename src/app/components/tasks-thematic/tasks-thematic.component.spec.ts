import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksThematicComponent } from './tasks-thematic.component';
import { RouterModule } from '@angular/router';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TasksThematicComponent', () => {
  let component: TasksThematicComponent;
  let fixture: ComponentFixture<TasksThematicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksThematicComponent ],
      imports: [ RouterModule, MatIconTestingModule]
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
