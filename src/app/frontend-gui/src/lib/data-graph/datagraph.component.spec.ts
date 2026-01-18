import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxEchartsModule } from 'ngx-echarts';

import { DatagraphComponent } from './datagraph.component';

// Polyfill for ResizeObserver in test environment
class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
}

describe('DatagraphComponent', () => {
  let component: DatagraphComponent;
  let fixture: ComponentFixture<DatagraphComponent>;

  beforeAll(() => {
    // Add ResizeObserver polyfill to global scope
    if (typeof global.ResizeObserver === 'undefined') {
      (global as any).ResizeObserver = ResizeObserver;
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatagraphComponent ],
      imports: [
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts')
        })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
