import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTreeComponent } from './map-tree.component';

describe('MapTreeComponent', () => {
  let component: MapTreeComponent;
  let fixture: ComponentFixture<MapTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
