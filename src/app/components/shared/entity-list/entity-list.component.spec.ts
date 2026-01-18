import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of , firstValueFrom, Observable, toArray } from 'rxjs';


import { Resource } from '@app/core';

import { EntityListComponent, EntityListConfig } from './entity-list.component';

class TestResource extends Resource {
  constructor() {
    super();
  }
}

describe('EntityListComponent', () => {
  let component: EntityListComponent<TestResource>;
  let fixture: ComponentFixture<EntityListComponent<TestResource>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityListComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityListComponent<TestResource>);
    component = fixture.componentInstance;
  });

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
