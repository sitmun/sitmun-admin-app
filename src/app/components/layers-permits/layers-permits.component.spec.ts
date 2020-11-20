import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersPermitsComponent } from './layers-permits.component';

describe('LayersPermitsComponent', () => {
  let component: LayersPermitsComponent;
  let fixture: ComponentFixture<LayersPermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayersPermitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
