import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FileDatabase , DataTreeComponent } from './data-tree.component';


describe('DataTreeComponent', () => {
  let component: DataTreeComponent;
  let fixture: ComponentFixture<DataTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTreeComponent ],
      imports: [
        TranslateModule.forRoot(),
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        FileDatabase,
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTreeComponent);
    component = fixture.componentInstance;

    component.getAll = () => of([]);
    component.allNewElements = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
