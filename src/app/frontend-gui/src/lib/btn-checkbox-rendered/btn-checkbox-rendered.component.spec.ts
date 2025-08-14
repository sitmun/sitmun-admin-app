import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BtnCheckboxRenderedComponent } from './btn-checkbox-rendered.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BtnCheckboxRenderedComponent', () => {
  let component: BtnCheckboxRenderedComponent;
  let fixture: ComponentFixture<BtnCheckboxRenderedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnCheckboxRenderedComponent ],
      imports: [
        MatCheckboxModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnCheckboxRenderedComponent);
    component = fixture.componentInstance;
    
    // Set up the params property with mock data
    component.params = {
      value: false,
      column: { colId: 'test' },
      node: { 
        rowIndex: 0,
        setDataValue: () => {} 
      },
      colDef: { 
        headerName: 'Test',
        editable: true
      },
      api: {
        undoRedoService: { isFilling: false }
      },
      context: {
        componentParent: { methodFromParent: () => {} }
      }
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
