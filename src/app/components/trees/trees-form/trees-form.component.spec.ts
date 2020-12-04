import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreesFormComponent } from './trees-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('TreesFormComponent', () => {
  let component: TreesFormComponent;
  let fixture: ComponentFixture<TreesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreesFormComponent ],
      imports: [ RouterModule.forRoot([]), MaterialModule, RouterModule, MatIconTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
