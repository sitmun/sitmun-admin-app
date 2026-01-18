import { MatDialog } from '@angular/material/dialog';

import { firstValueFrom, toArray , of } from 'rxjs';

import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';

import { DataTableDefinition } from './data-tables.util';

describe('DataTableDefinitionBuilder', () => {
  let builder: ReturnType<typeof DataTableDefinition.builder>;
  let matDialog: jest.Mocked<MatDialog>;
  let errorHandler: jest.Mocked<ErrorHandlerService>;
  let loadingService: jest.Mocked<LoadingOverlayService>;

  beforeEach(() => {
    matDialog = {} as any;
    errorHandler = {
      handleError: jest.fn()
    } as any;
    loadingService = {
      wrap: jest.fn().mockImplementation((fn) => fn())
    } as any;

    builder = DataTableDefinition.builder(matDialog, errorHandler, loadingService);
  });

  it('should create', () => {
    expect(builder).toBeTruthy();
  });

  describe('default relationsFetchFn', () => {
    it('should return of([]) observable when not overridden', async () => {
      const definition = builder.build();
      const result = definition.relationsFetchFn();
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([[]]);
    });

    it('should emit empty array then complete when not overridden', (done) => {
      const definition = builder.build();
      const result = definition.relationsFetchFn();
      let emittedValue: any;
      result.subscribe({
        next: (value) => { emittedValue = value; },
        complete: () => {
          expect(emittedValue).toEqual([]);
          done();
        }
      });
    });
  });

  describe('default targetsFetchFn', () => {
    it('should return of([]) observable when not overridden', async () => {
      const definition = builder.build();
      // Access private property via type assertion for testing
      const targetsFetchFn = (definition as any).targetsFetchFn;
      const result = targetsFetchFn();
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([[]]);
    });

    it('should emit empty array then complete when not overridden', (done) => {
      const definition = builder.build();
      const targetsFetchFn = (definition as any).targetsFetchFn;
      const result = targetsFetchFn();
      let emittedValue: any;
      result.subscribe({
        next: (value) => { emittedValue = value; },
        complete: () => {
          expect(emittedValue).toEqual([]);
          done();
        }
      });
    });
  });

  describe('withRelationsFetcher', () => {
    it('should override default relationsFetchFn', async () => {
      const testData = [{ id: 1 }];
      builder.withRelationsFetcher(() => of(testData));
      const definition = builder.build();
      const result = definition.relationsFetchFn();
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([testData]);
    });
  });

  describe('withTargetsFetcher', () => {
    it('should override default targetsFetchFn', async () => {
      const testData = [{ id: 1 }];
      builder.withTargetsFetcher(() => of(testData));
      const definition = builder.build();
      const targetsFetchFn = (definition as any).targetsFetchFn;
      const result = targetsFetchFn();
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([testData]);
    });
  });
});
