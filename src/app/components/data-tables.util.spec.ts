import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { firstValueFrom, toArray , of } from 'rxjs';

import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';

import { DataTableDefinition, DataTable2Definition, TemplateDialog } from './data-tables.util';

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

  describe('openTemplateDialog', () => {
    it('opens DialogFormComponent with formDialogs sizing', () => {
      const afterClosedSubject = of(null);
      matDialog.open = jest.fn().mockReturnValue({
        afterClosed: () => afterClosedSubject
      });

      const definition = DataTableDefinition.builder(matDialog, errorHandler, loadingService)
        .withTemplateDialog('testDialog', () => TemplateDialog.builder()
          .withReference({} as any)
          .withTitle('dialog.title')
          .withForm(new FormGroup({ name: new FormControl(null) }))
          .build())
        .build();

      definition.openTemplateDialog('testDialog');

      expect(matDialog.open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          panelClass: 'formDialogs',
          width: '640px',
          maxWidth: '90vw',
        })
      );
    });
  });

  describe('Capability flags', () => {
    describe('default builder', () => {
      it('should have no picker add capability', () => {
        const definition = builder.build();
        expect(definition.hasPickerAdd()).toBe(false);
      });

      it('should have no relations updater capability', () => {
        const definition = builder.build();
        expect(definition.hasRelationsUpdater()).toBe(false);
      });

      it('should have no duplicate capability', () => {
        const definition = builder.build();
        expect(definition.supportsDuplicate()).toBe(false);
      });

      it('should have no template dialogs capability', () => {
        const definition = builder.build();
        expect(definition.hasTemplateDialogs()).toBe(false);
      });

      it('should have no status column when no columns defined', () => {
        const definition = builder.build();
        expect(definition.hasStatusColumn()).toBe(false);
      });
    });

    describe('withRelationsUpdater', () => {
      it('should enable relations updater capability', () => {
        const updater = jest.fn().mockResolvedValue(undefined);
        const definition = builder
          .withRelationsUpdater(updater)
          .build();
        
        expect(definition.hasRelationsUpdater()).toBe(true);
      });

      it('should not enable other capabilities', () => {
        const updater = jest.fn().mockResolvedValue(undefined);
        const definition = builder
          .withRelationsUpdater(updater)
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
        expect(definition.supportsDuplicate()).toBe(false);
        expect(definition.hasTemplateDialogs()).toBe(false);
      });
    });

    describe('picker configuration', () => {
      it('should enable picker add when all picker components configured', () => {
        const definition = builder
          .withTargetsColumns([{ field: 'name' }])
          .withTargetsFetcher(() => of([]))
          .withTargetToRelation((items) => items as any)
          .build();
        
        expect(definition.hasPickerAdd()).toBe(true);
      });

      it('should not enable picker add with only columns', () => {
        const definition = builder
          .withTargetsColumns([{ field: 'name' }])
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
      });

      it('should not enable picker add with only fetcher', () => {
        const definition = builder
          .withTargetsFetcher(() => of([]))
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
      });

      it('should not enable picker add with columns and fetcher but no converter', () => {
        const definition = builder
          .withTargetsColumns([{ field: 'name' }])
          .withTargetsFetcher(() => of([]))
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
      });
    });

    describe('withRelationsDuplicate', () => {
      it('should enable duplicate capability', () => {
        const duplicator = (item: any) => ({ ...item });
        const definition = builder
          .withRelationsDuplicate(duplicator)
          .build();
        
        expect(definition.supportsDuplicate()).toBe(true);
      });

      it('should not enable other capabilities', () => {
        const duplicator = (item: any) => ({ ...item });
        const definition = builder
          .withRelationsDuplicate(duplicator)
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
        expect(definition.hasRelationsUpdater()).toBe(false);
        expect(definition.hasTemplateDialogs()).toBe(false);
      });
    });

    describe('status column detection', () => {
      it('should detect status column in relations columns', () => {
        const definition = builder
          .withRelationsColumns([
            { field: 'name' },
            { field: 'status' },
            { field: 'value' }
          ])
          .build();
        
        expect(definition.hasStatusColumn()).toBe(true);
      });

      it('should not detect status column when not present', () => {
        const definition = builder
          .withRelationsColumns([
            { field: 'name' },
            { field: 'value' }
          ])
          .build();
        
        expect(definition.hasStatusColumn()).toBe(false);
      });

      it('should handle null/undefined column definitions', () => {
        const definition = builder
          .withRelationsColumns([
            { field: 'name' },
            null,
            undefined,
            { field: 'value' }
          ] as any)
          .build();
        
        expect(definition.hasStatusColumn()).toBe(false);
      });
    });

    describe('withTemplateDialog', () => {
      it('should enable template dialogs capability', () => {
        const definition = builder
          .withTemplateDialog('test', () => TemplateDialog.builder()
            .withReference({} as any)
            .withTitle('Test')
            .withForm(new FormGroup({}))
            .build())
          .build();
        
        expect(definition.hasTemplateDialogs()).toBe(true);
      });

      it('should not enable other capabilities', () => {
        const definition = builder
          .withTemplateDialog('test', () => TemplateDialog.builder()
            .withReference({} as any)
            .withTitle('Test')
            .withForm(new FormGroup({}))
            .build())
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
        expect(definition.hasRelationsUpdater()).toBe(false);
        expect(definition.supportsDuplicate()).toBe(false);
      });
    });
  });
});

describe('DataTable2DefinitionBuilder', () => {
  let builder: ReturnType<typeof DataTable2Definition.builder>;
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

    builder = DataTable2Definition.builder(matDialog, errorHandler, loadingService);
  });

  it('should create', () => {
    expect(builder).toBeTruthy();
  });

  describe('Capability flags', () => {
    describe('default builder', () => {
      it('should have no picker add capability', () => {
        const definition = builder.build();
        expect(definition.hasPickerAdd()).toBe(false);
      });

      it('should have no relations updater capability', () => {
        const definition = builder.build();
        expect(definition.hasRelationsUpdater()).toBe(false);
      });

      it('should have no duplicate capability', () => {
        const definition = builder.build();
        expect(definition.supportsDuplicate()).toBe(false);
      });

      it('should have no template dialogs capability for DataTable2Definition', () => {
        const definition = builder.build();
        expect(definition.hasTemplateDialogs()).toBe(false);
      });

      it('should have no status column when no columns defined', () => {
        const definition = builder.build();
        expect(definition.hasStatusColumn()).toBe(false);
      });
    });

    describe('withRelationsUpdater', () => {
      it('should enable relations updater capability', () => {
        const updater = jest.fn().mockResolvedValue(undefined);
        const definition = builder
          .withRelationsUpdater(updater)
          .build();
        
        expect(definition.hasRelationsUpdater()).toBe(true);
      });
    });

    describe('dual-target picker configuration', () => {
      it('should enable picker add when all dual-target components configured', () => {
        const definition = builder
          .withTargetsLeftColumns([{ field: 'name' }])
          .withTargetsRightColumns([{ field: 'role' }])
          .withTargetsLeftFetcher(() => of([]))
          .withTargetsRightFetcher(() => of([]))
          .withTargetToRelation((left, right) => [] as any)
          .build();
        
        expect(definition.hasPickerAdd()).toBe(true);
      });

      it('should not enable picker add with only left columns', () => {
        const definition = builder
          .withTargetsLeftColumns([{ field: 'name' }])
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
      });

      it('should not enable picker add with columns but missing fetchers', () => {
        const definition = builder
          .withTargetsLeftColumns([{ field: 'name' }])
          .withTargetsRightColumns([{ field: 'role' }])
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
      });

      it('should not enable picker add with columns and fetchers but no converter', () => {
        const definition = builder
          .withTargetsLeftColumns([{ field: 'name' }])
          .withTargetsRightColumns([{ field: 'role' }])
          .withTargetsLeftFetcher(() => of([]))
          .withTargetsRightFetcher(() => of([]))
          .build();
        
        expect(definition.hasPickerAdd()).toBe(false);
      });
    });

    describe('withRelationsDuplicate', () => {
      it('should enable duplicate capability', () => {
        const duplicator = (item: any) => ({ ...item });
        const definition = builder
          .withRelationsDuplicate(duplicator)
          .build();
        
        expect(definition.supportsDuplicate()).toBe(true);
      });
    });

    describe('status column detection', () => {
      it('should detect status column in relations columns', () => {
        const definition = builder
          .withRelationsColumns([
            { field: 'name' },
            { field: 'status' },
            { field: 'value' }
          ])
          .build();
        
        expect(definition.hasStatusColumn()).toBe(true);
      });

      it('should not detect status column when not present', () => {
        const definition = builder
          .withRelationsColumns([
            { field: 'name' },
            { field: 'value' }
          ])
          .build();
        
        expect(definition.hasStatusColumn()).toBe(false);
      });
    });
  });
});
