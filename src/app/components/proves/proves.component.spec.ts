import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvesComponent } from './proves.component';

describe('ProvesComponent', () => {
  let component: ProvesComponent;
  let fixture: ComponentFixture<ProvesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
