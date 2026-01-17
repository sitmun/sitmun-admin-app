import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FileDatabase , DataTreeComponent } from './data-tree.component';


describe('DataTreeComponent', () => {
  let component: DataTreeComponent;
  let fixture: ComponentFixture<DataTreeComponent>;
  let _database: FileDatabase;

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
    database = TestBed.inject(FileDatabase);
    fixture = TestBed.createComponent(DataTreeComponent);
    component = fixture.componentInstance;

    // Mock the required inputs
    component.getAll = () => EMPTY;
    component.allNewElements = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
