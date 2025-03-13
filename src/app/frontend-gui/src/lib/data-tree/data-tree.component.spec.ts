import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTreeComponent } from './data-tree.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileDatabase } from './data-tree.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('DataTreeComponent', () => {
  let component: DataTreeComponent;
  let fixture: ComponentFixture<DataTreeComponent>;
  let database: FileDatabase;

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
    component.getAll = () => of([]);
    component.allNewElements = {};
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
