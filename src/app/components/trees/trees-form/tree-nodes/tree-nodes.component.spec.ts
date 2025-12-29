import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TreeNodesComponent} from './tree-nodes.component';

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TreeNodesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

