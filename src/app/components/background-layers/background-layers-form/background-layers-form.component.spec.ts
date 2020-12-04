import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundLayersFormComponent } from './background-layers-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material-module';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('BackgroundLayersFormComponent', () => {
  let component: BackgroundLayersFormComponent;
  let fixture: ComponentFixture<BackgroundLayersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundLayersFormComponent ],
      imports: [ RouterModule.forRoot([]),MaterialModule, MatIconTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
