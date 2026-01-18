import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { MapTreeComponent } from './map-tree.component';

describe('MapTreeComponent', () => {
  let component: MapTreeComponent;
  let fixture: ComponentFixture<MapTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTreeComponent ],
      imports: [
        MatTreeModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTreeComponent);
    component = fixture.componentInstance;
    component.getAll = () => of({ dataType: 'json', data: {} });
    component.allNewElements = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
