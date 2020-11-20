import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDocumentComponent } from './tasks-document.component';

describe('TasksDocumentComponent', () => {
  let component: TasksDocumentComponent;
  let fixture: ComponentFixture<TasksDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
