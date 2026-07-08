import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of , firstValueFrom, Observable, toArray } from 'rxjs';

import { Resource } from '@app/core';
import { DataGridComponent } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { MaterialModule } from '@app/material-module';
import { suppressAgGridConsoleWarnings } from '@app/testing/test-helpers';

import { EntityListComponent, EntityListConfig } from './entity-list.component';

class TestResource extends Resource {
  constructor() {
    super();
  }
}

describe('EntityListComponent', () => {
  let component: EntityListComponent<TestResource>;
  let fixture: ComponentFixture<EntityListComponent<TestResource>>;
  let restoreConsoleWarn: () => void;

  beforeAll(() => {
    restoreConsoleWarn = suppressAgGridConsoleWarnings();
  });

  afterAll(() => {
    restoreConsoleWarn?.();
  });

  beforeAll(async () => {
     
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: 0 as any },
      declarations: [EntityListComponent],
      imports: [
        MaterialModule,
        DataGridComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListComponent<TestResource>);
    component = fixture.componentInstance;
  });

  afterEach(() => fixture?.destroy());
  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default dataFetchFn fallback', () => {
    it('should return of([]) when config is not provided', async () => {
      component.config = undefined as any;
      const result = component.dataFetchFn();
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([[]]);
    });

    it('should emit empty array then complete when config is missing', (done) => {
      component.config = undefined as any;
      const result = component.dataFetchFn();
      let emittedValue: any;
      result.subscribe({
        next: (value) => { emittedValue = value; },
        complete: () => {
          expect(emittedValue).toEqual([]);
          done();
        }
      });
    });

    it('should use provided dataFetchFn when config is provided', async () => {
      const testData = [new TestResource()];
      const config: EntityListConfig<TestResource> = {
        entityLabel: 'test',
        font: 'test',
        iconName: 'test',
        columnDefs: [],
        dataFetchFn: () => new Observable(subscriber => {
          subscriber.next(testData);
          subscriber.complete();
        })
      };
      component.config = config;
      const result = component.dataFetchFn();
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([testData]);
    });
  });
});
