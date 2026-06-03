import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {firstValueFrom, of} from 'rxjs';

import {FormToolbarComponent} from '@app/components/shared/form-toolbar/form-toolbar.component';
import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import {ExternalService, ResourceService} from '@app/core/hal';
import {
  ApplicationService,
  CapabilitiesService,
  CartographyService,
  CodeListService,
  RoleService,
  ServiceService,
  TaskService,
  TranslationService,
  Tree,
  TreeNodeService,
  TreeService
} from '@app/domain';
import { AdminRuntimeConfigurationService } from '@app/domain/admin-configuration/services/admin-runtime-configuration.service';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { MaterialModule } from '@app/material-module';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import {LoggerService} from '@app/services/logger.service';
import {configureLoggerForTests, provideErrorHandlerForTests} from '@app/testing/test-helpers';

import {
  assignTreeNodesStub,
  createMockDataTree,
  createTouristicRootNode,
  createTouristicRootWithMenu,
} from './testing/tree-form-test-helpers';
import { TreesFormComponent } from './trees-form.component';

describe('TreesFormComponent', () => {
  let component: TreesFormComponent;
  let fixture: ComponentFixture<TreesFormComponent>;
  let treeService: TreeService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
       
      teardown: { destroyAfterEach: 0 as any },
      declarations: [ TreesFormComponent, FormToolbarComponent ],
      imports: [FormsModule, ReactiveFormsModule,SitmunFrontendGuiModule, RouterModule.forRoot([], {}), MaterialModule, MatIconTestingModule, BrowserAnimationsModule,
         TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        })],
      providers: [provideErrorHandlerForTests(), TreeService, TreeNodeService, ApplicationService, ServiceService, CapabilitiesService, CartographyService, CodeListService, TranslationService, ResourceService, ExternalService, TaskService, RoleService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        {
          provide: AdminRuntimeConfigurationService,
          useValue: { getTreeImageUploadConfiguration: () => of({ supportedFormats: ['png', 'jpg', 'jpeg'], maxBytes: 2_097_152, defaultSize: { width: 125, height: 125 }, sizesByType: { menu: { width: 50, height: 50 }, list: { width: 350, height: 350 } } }) }
        }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesFormComponent);
    component = fixture.componentInstance;
    // Suppress debug logs in tests to reduce console noise
    const loggerService = TestBed.inject(LoggerService);
    configureLoggerForTests(loggerService);
    jest.spyOn(loggerService, 'warn').mockImplementation(() => {});
    treeService = TestBed.inject(TreeService);

    // Mock treeNodesComponent BEFORE any getter access (canSaveEntity is called during detectChanges)
    assignTreeNodesStub(component);

    // Initialize form if not already initialized
    if (!component.entityForm) {
      component.entityToEdit = component.empty();
      component.postFetchData();
    }
    // Don't call detectChanges() here to avoid triggering canSaveEntity getter
    // Individual tests can call it if needed
  });

  afterEach(() => {
    fixture?.destroy();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form tree invalid when empty', () => {
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form tree invalid when mid-empty', () => {
    component.entityForm.patchValue({
      description: 'description',
      image: 'www.image.com'
    })
    //Miss name
    expect(component.entityForm.valid).toBeFalsy();
  });

  it('form tree valid', () => {
    component.entityForm.patchValue({
      name: 'name',
      type: 'type',
      description: 'description',
      image: 'www.image.com'
    })
    expect(component.entityForm.valid).toBeTruthy();
  });

  it('Tree form fields', () => {
    expect(component.entityForm.get('name')).toBeTruthy();
    expect(component.entityForm.get('description')).toBeTruthy();
    expect(component.entityForm.get('image')).toBeTruthy();
  });

  describe('treeValidations does not show errors from getters', () => {
    beforeEach(() => {
      component.currentTreeType = 'touristic';
      component.entityForm.patchValue({ name: 'Test', type: 'touristic', description: 'desc' });
      assignTreeNodesStub(component, {
        hasUnsavedChanges: jest.fn(() => true),
        hasUnsavedChangesForToolbar: jest.fn(() => true),
        getNodesForValidation: jest.fn(() => [createTouristicRootWithMenu()] as any),
      });
    });

    it('canSaveEntity getter does not open dialogs when validation fails', () => {
      const showErrorSpy = jest.spyOn(component.utils, 'showTreeStructureError').mockImplementation(() => {});

      expect(showErrorSpy).not.toHaveBeenCalled();
      showErrorSpy.mockRestore();
    });

    it('canSave does not open dialogs when validation fails', () => {
      const showErrorSpy = jest.spyOn(component.utils, 'showTreeStructureError').mockImplementation(() => {});

      component.canSave();

      expect(showErrorSpy).not.toHaveBeenCalled();
      showErrorSpy.mockRestore();
    });

    it('treeValidations(true) shows errors when validation fails', () => {
      const showErrorSpy = jest.spyOn(component.utils, 'showTreeStructureError').mockImplementation(() => {});

      component.treeValidations(true);

      expect(showErrorSpy).toHaveBeenCalled();
      showErrorSpy.mockRestore();
    });

    it('calling canSaveEntity many times never triggers error dialogs', () => {
      const showErrorSpy = jest.spyOn(component.utils, 'showTreeStructureError').mockImplementation(() => {});
      const showRequiredSpy = jest.spyOn(component.utils, 'showRequiredFieldsError').mockImplementation(() => {});
      const showNodeTypeSpy = jest.spyOn(component.utils, 'showNodeTypeConstraintError').mockImplementation(() => {});

      for (let i = 0; i < 100; i++) {
        // invoke getter repeatedly to ensure no side-effect dialogs are triggered
        void component.canSaveEntity;
      }

      expect(showErrorSpy).not.toHaveBeenCalled();
      expect(showRequiredSpy).not.toHaveBeenCalled();
      expect(showNodeTypeSpy).not.toHaveBeenCalled();
      showErrorSpy.mockRestore();
      showRequiredSpy.mockRestore();
      showNodeTypeSpy.mockRestore();
    });
  });

  describe('validTreeStructure for touristic trees', () => {
    beforeEach(() => {
      component.currentTreeType = 'touristic';
    });

    it('returns true for empty root (no children)', () => {
      const treeNodes: any[] = [{ isRoot: true, children: [] }];
      expect(component.validTreeStructure(treeNodes)).toBe(true);
    });

    it('returns false for root with one menu child that has no children', () => {
      const treeNodes: any[] = [{
        isRoot: true,
        children: [{ name: 'Menu', nodeType: 'menu', children: [], status: 'pendingCreation' }]
      }];
      expect(component.validTreeStructure(treeNodes)).toBe(false);
    });

    it('returns true for root with one menu child that has children', () => {
      const treeNodes: any[] = [{
        isRoot: true,
        children: [{
          name: 'Menu', nodeType: 'menu', status: 'pendingCreation',
          children: [{ name: 'Task', nodeType: 'task', children: [], status: 'pendingCreation' }]
        }]
      }];
      expect(component.validTreeStructure(treeNodes)).toBe(true);
    });

    it('ignores pendingDelete children when validating structure', () => {
      const treeNodes: any[] = [{
        isRoot: true,
        children: [{ name: 'Deleted', nodeType: 'menu', children: [], status: 'pendingDelete' }]
      }];
      expect(component.validTreeStructure(treeNodes)).toBe(true);
    });

    it('returns true for non-touristic tree types regardless of structure', () => {
      component.currentTreeType = 'cartography';
      const treeNodes: any[] = [{
        isRoot: true,
        children: [{ name: 'Folder', nodeType: 'folder', children: [], status: 'pendingCreation' }]
      }];
      expect(component.validTreeStructure(treeNodes)).toBe(true);
    });
  });

  describe('treeValidationWarningMessage', () => {
    beforeEach(() => {
      component.dataLoaded = true;
      component.entityForm.patchValue({ name: 'Tree', type: 'touristic' });
      component.currentTreeType = 'touristic';
    });

    it('returns empty when form has required-field errors', () => {
      component.entityForm.patchValue({ name: null });
      assignTreeNodesStub(component, {
        hasUnsavedChanges: jest.fn(() => true),
        hasUnsavedChangesForToolbar: jest.fn(() => true),
        getNodesForValidation: jest.fn(() => []),
      });

      expect(component.treeValidationWarningMessage).toBe('');
    });

    it('does not throw when tree nodes are not loaded yet', () => {
      assignTreeNodesStub(component, {
        getNodesForValidation: jest.fn(() => []),
      });

      expect(() => component.treeValidationWarningMessage).not.toThrow();
      expect(component.treeValidationWarningMessage).toBe('');
    });

    it('returns tree structure message when structure validation fails', () => {
      assignTreeNodesStub(component, {
        hasUnsavedChanges: jest.fn(() => true),
        hasUnsavedChangesForToolbar: jest.fn(() => true),
        getNodesForValidation: jest.fn(() => [createTouristicRootWithMenu()] as any),
      });

      expect(component.treeValidationWarningMessage).toBe('treeStructureMessage.touristic.rootMustHaveChildren');
    });

    it('returns specific message when more than one top-level node exists', () => {
      const rootNode = createTouristicRootNode({
        children: [
          { name: 'Menu 1', nodeType: 'menu', children: [{ name: 'Task', children: [] }], status: 'pendingCreation', parent: null },
          { name: 'Menu 2', nodeType: 'menu', children: [{ name: 'Task', children: [] }], status: 'pendingCreation', parent: null }
        ]
      });
      assignTreeNodesStub(component, {
        hasUnsavedChanges: jest.fn(() => true),
        hasUnsavedChangesForToolbar: jest.fn(() => true),
        getNodesForValidation: jest.fn(() => [rootNode] as any),
      });

      expect(component.treeValidationWarningMessage).toBe('treeStructureMessage.touristic.singleRoot');
    });
  });

  describe('Tree type node constraints', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock getNodesForValidation to return test nodes
      component.treeNodesComponent.getNodesForValidation = jest.fn();
      component.currentTreeType = 'touristic';
      // Suppress expected validation warnings (node type not allowed for tree type)
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy?.mockRestore();
    });

    it('should validate compatible nodes for touristic tree type', () => {
      const nodes: any[] = [
        { id: 1, name: 'Menu node', nodeType: 'menu', parent: null },
        { id: 2, name: 'Task node', nodeType: 'task', parent: 1 }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);

      const result = component.validNodeTypesForTreeType(nodes);
      expect(result).toBe(true);
    });

    it('should reject incompatible node type for tree type', () => {
      const nodes: any[] = [
        { id: 1, name: 'Menu node', nodeType: 'menu', parent: null }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);
      component.currentTreeType = 'edition';

      const result = component.validNodeTypesForTreeType(nodes);
      expect(result).toBe(false);
    });

    it('should reject invalid parent-child relationship', () => {
      const nodes: any[] = [
        { id: 1, name: 'Menu folder', nodeType: 'menu', parent: null },
        { id: 2, name: 'Cartography child', nodeType: 'cartography', parent: 1 }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);
      component.currentTreeType = 'touristic';

      const result = component.validNodeTypesForTreeType(nodes);
      expect(result).toBe(false);
    });

    it('should allow fav and nm under menu for touristic tree', () => {
      const nodes: any[] = [
        { id: 1, name: 'Menu folder', nodeType: 'menu', parent: null },
        { id: 2, name: 'Favorites', nodeType: 'fav', parent: 1 },
        { id: 3, name: 'Near me', nodeType: 'nm', parent: 1 }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);
      component.currentTreeType = 'touristic';

      const result = component.validNodeTypesForTreeType(nodes);
      expect(result).toBe(true);
    });

    it('should allow empty folders', () => {
      const nodes: any[] = [
        { id: 1, name: 'Empty menu folder', nodeType: 'menu', parent: null }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);
      component.currentTreeType = 'touristic';

      const result = component.validNodeTypesForTreeType(nodes);
      expect(result).toBe(true);
    });

    it('should allow nodes with null type (legacy folders)', () => {
      const nodes: any[] = [
        { id: 1, name: 'Legacy folder', nodeType: null, parent: null },
        { id: 2, name: 'Task child', nodeType: 'task', parent: 1 }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);
      component.currentTreeType = 'touristic'; // task allowed under legacy (null) parent

      const result = component.validNodeTypesForTreeType(nodes);
      expect(result).toBe(true);
    });

    it('should prevent tree type change when nodes are incompatible', () => {
      const nodes: any[] = [
        { id: 1, name: 'Menu folder', nodeType: 'menu', parent: null, status: 'statusOK' }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);
      component.currentTreeType = 'touristic';
      component.entityForm.patchValue({ type: 'touristic' });

      // Mock the utils method
      component.utils.showNodeTypeConstraintError = jest.fn();

      // Try to change to cartography (which doesn't allow menu)
      component.onTreeTypeChange('cartography');

      // Should still be touristic
      expect(component.currentTreeType).toBe('touristic');
      expect(component.entityForm.value.type).toBe('touristic');
      expect(component.utils.showNodeTypeConstraintError).toHaveBeenCalled();
    });
  });

  describe('TreeNodesComponent consumer contracts', () => {
    beforeEach(() => {
      const mockDataTree = createMockDataTree();
      assignTreeNodesStub(component, {
        dataTree: mockDataTree,
        getNodesForValidation: jest.fn(() => mockDataTree.dataSource.data as any),
      });
    });

    it('getNodesForValidation returns array with root node that has .children', () => {
      const nodes = component.treeNodesComponent.getNodesForValidation();
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
      expect(nodes[0]).toHaveProperty('children');
      expect((nodes[0] as any).isRoot).toBe(true);
    });
  });

  describe('createObject', () => {
    beforeEach(() => {
      component.entityToEdit = { id: 99, name: 'Original', type: 'touristic', description: 'desc' } as Tree;
      component.entityForm.patchValue({
        name: 'Modified Name',
        type: 'cartography',
        description: 'modified desc',
        image: 'new-image.png'
      });
    });

    it('creates object with null id when no id parameter provided', () => {
      const result = component.createObject();
      expect(result.id).toBeNull();
      expect(result.name).toBe('Modified Name');
      expect(result.type).toBe('cartography');
    });

    it('creates object with provided id parameter', () => {
      const result = component.createObject(42);
      expect(result.id).toBe(42);
      expect(result.name).toBe('Modified Name');
    });

    it('merges form values with entityToEdit base', () => {
      const result = component.createObject(50);
      expect(result).toBeInstanceOf(Tree);
      expect(result.description).toBe('modified desc');
      expect(result.image).toBe('new-image.png');
    });
  });

  describe('getTreeStructureWarningMessage', () => {
    beforeEach(() => {
      component.currentTreeType = 'touristic';
    });

    it('returns generic message for non-touristic tree types', () => {
      component.currentTreeType = 'cartography';
      const nodes: any[] = [{ isRoot: true, children: [] }];
      const message = (component as any).getTreeStructureWarningMessage(nodes);
      expect(message).toContain('treeStructureMessage');
      expect(message).not.toContain('.touristic.');
    });

    it('returns generic message for empty or invalid node array', () => {
      let message = (component as any).getTreeStructureWarningMessage([]);
      expect(message).toContain('treeStructureMessage');

      message = (component as any).getTreeStructureWarningMessage(null);
      expect(message).toContain('treeStructureMessage');
    });

    it('returns singleRoot message when multiple root children exist', () => {
      const nodes: any[] = [{
        isRoot: true,
        children: [
          { name: 'Menu 1', status: 'pendingCreation', children: [{ name: 'Task', children: [] }] },
          { name: 'Menu 2', status: 'pendingCreation', children: [{ name: 'Task', children: [] }] }
        ]
      }];
      const message = (component as any).getTreeStructureWarningMessage(nodes);
      expect(message).toContain('treeStructureMessage.touristic.singleRoot');
    });

    it('returns rootMustHaveChildren message when single root child has no children', () => {
      const nodes: any[] = [{
        isRoot: true,
        children: [{ name: 'Menu', status: 'pendingCreation', children: [] }]
      }];
      const message = (component as any).getTreeStructureWarningMessage(nodes);
      expect(message).toContain('treeStructureMessage.touristic.rootMustHaveChildren');
    });

    it('returns generic message when root child has valid children', () => {
      const nodes: any[] = [{
        isRoot: true,
        children: [{
          name: 'Menu',
          status: 'pendingCreation',
          children: [{ name: 'Task', children: [] }]
        }]
      }];
      const message = (component as any).getTreeStructureWarningMessage(nodes);
      expect(message).toContain('treeStructureMessage');
    });
  });

  describe('onTreeTypeChange', () => {
    beforeEach(() => {
      component.currentTreeType = 'touristic';
      component.entityForm.patchValue({ type: 'touristic' });
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => []);
    });

    it('updates currentTreeType when validation passes', () => {
      jest.spyOn(component as any, 'validateTreeTypeCompatibility').mockReturnValue(true);

      component.onTreeTypeChange('cartography');

      expect(component.currentTreeType).toBe('cartography');
    });

    it('reverts form type and shows error when validation fails', () => {
      jest.spyOn(component as any, 'validateTreeTypeCompatibility').mockReturnValue(false);
      const showErrorSpy = jest.spyOn(component.utils, 'showNodeTypeConstraintError').mockImplementation(() => {});

      component.onTreeTypeChange('cartography');

      expect(component.currentTreeType).toBe('touristic');
      expect(component.entityForm.value.type).toBe('touristic');
      expect(showErrorSpy).toHaveBeenCalled();
      showErrorSpy.mockRestore();
    });
  });

  describe('Image handling methods', () => {
    let input: HTMLInputElement;

    beforeEach(() => {
      input = document.createElement('input');
      input.readOnly = true;
    });

    describe('activeImageNameInput', () => {
      it('clears image fields and makes input editable', () => {
        component.entityForm.patchValue({ image: 'old.png', imageName: 'old.png' });
        const focusSpy = jest.spyOn(input, 'focus');

        component.activeImageNameInput('tree', input);

        expect(component.entityForm.value.image).toBeNull();
        expect(component.entityForm.value.imageName).toBeNull();
        expect(input.readOnly).toBe(false);
        expect(focusSpy).toHaveBeenCalled();
      });
    });

    describe('removeImage', () => {
      it('clears both image and imageName fields', () => {
        component.entityForm.patchValue({ image: 'test.png', imageName: 'test.png' });

        component.removeImage('tree');

        expect(component.entityForm.value.image).toBeNull();
        expect(component.entityForm.value.imageName).toBeNull();
      });
    });

    describe('onImageChange', () => {
      it('updates image field when input is not readonly', () => {
        input.readOnly = false;
        input.value = 'http://example.com/image.png';
        const event = { target: input } as any;

        component.onImageChange('tree', event);

        expect(component.entityForm.value.image).toBe('http://example.com/image.png');
      });

      it('does not update image field when input is readonly', () => {
        input.readOnly = true;
        input.value = 'http://example.com/image.png';
        component.entityForm.patchValue({ image: 'existing.png' });
        const event = { target: input } as any;

        component.onImageChange('tree', event);

        expect(component.entityForm.value.image).toBe('existing.png');
      });
    });

    describe('onImageSelected', () => {
      it('reads and sets image data URL for valid image file', (done) => {
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const fileInput = document.createElement('input');
        Object.defineProperty(fileInput, 'files', {
          value: [file],
          writable: false
        });
        const event = { target: fileInput } as any;

        component.onImageSelected('tree', event);

        setTimeout(() => {
          expect(component.entityForm.value.image).toBeTruthy();
          expect(component.entityForm.value.imageName).toBe('test.png');
          done();
        }, 100);
      });

      it('shows error for non-image files', async () => {
        const errorHandler = TestBed.inject(ErrorHandlerService);
        const handleErrorSpy = jest.spyOn(errorHandler, 'handleError').mockReturnValue(null);
        const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
        const fileInput = document.createElement('input');
        Object.defineProperty(fileInput, 'files', {
          value: [file],
          writable: false
        });
        const event = { target: fileInput } as any;
        component.entityForm.patchValue({ image: 'existing.png', imageName: 'existing.png' });

        await component.onImageSelected('tree', event);

        expect(handleErrorSpy).toHaveBeenCalledWith(null, 'entity.tree.image.error.invalidType', { formats: 'PNG, JPG, JPEG' });
        expect(component.entityForm.value.image).toBe('existing.png');
        expect(component.entityForm.value.imageName).toBe('existing.png');
      });

      it('shows error when file exceeds size limit', async () => {
        const errorHandler = TestBed.inject(ErrorHandlerService);
        const handleErrorSpy = jest.spyOn(errorHandler, 'handleError').mockReturnValue(null);
        const bytes = new Uint8Array(2 * 1024 * 1024 + 1);
        const file = new File([bytes], 'large.png', { type: 'image/png' });
        const fileInput = document.createElement('input');
        Object.defineProperty(fileInput, 'files', {
          value: [file],
          writable: false
        });
        const event = { target: fileInput } as any;

        await component.onImageSelected('tree', event);

        expect(handleErrorSpy).toHaveBeenCalledWith(null, 'entity.tree.image.error.tooLarge', { maxSizeMb: 2 });
      });

      it('does nothing when no file is selected', () => {
        const fileInput = document.createElement('input');
        Object.defineProperty(fileInput, 'files', {
          value: [],
          writable: false
        });
        const event = { target: fileInput } as any;
        component.entityForm.patchValue({ image: 'existing.png' });

        component.onImageSelected('tree', event);

        expect(component.entityForm.value.image).toBe('existing.png');
      });
    });
  });

  describe('validTreeForm', () => {
    beforeEach(() => {
      component.currentTreeType = 'touristic';
      component.entityForm.patchValue({ name: 'Test', type: 'touristic', description: 'desc' });
    });

    it('returns false when form is invalid', () => {
      component.entityForm.patchValue({ name: null });
      expect((component as any).validTreeForm()).toBe(false);
    });

    it('returns true when form is valid', () => {
      expect((component as any).validTreeForm()).toBe(true);
    });
  });

  describe('validNodeTypesForTreeType with pendingDelete', () => {
    beforeEach(() => {
      component.currentTreeType = 'touristic';
    });

    it('does not ignore pendingDelete nodes during validation', () => {
      const nodes: any[] = [
        { id: 1, name: 'Valid Menu', nodeType: 'menu', status: 'pendingCreation', parent: null },
        { id: 2, name: 'Deleted Invalid', nodeType: 'cartography', status: 'pendingDelete', parent: null }
      ];
      component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes);

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      // cartography is not allowed in touristic tree - even pendingDelete nodes are validated
      const result = component.validNodeTypesForTreeType(nodes);
      warnSpy.mockRestore();

      // validNodeTypesForTreeType does not filter pendingDelete - that's the caller's job
      expect(result).toBe(false);
    });
  });

  describe('Additional method coverage', () => {
    describe('onTreeSaveRequested', () => {
      it('calls onSaveButtonClicked when tree structure requests save', () => {
        const saveSpy = jest.spyOn(component, 'onSaveButtonClicked').mockResolvedValue(true);

        component.onTreeSaveRequested();

        expect(saveSpy).toHaveBeenCalled();
        saveSpy.mockRestore();
      });
    });

    describe('onTabChange', () => {
      it('handles tab change event', () => {
        const event = { index: 1 } as any;

        expect(() => component.onTabChange(event)).not.toThrow();
      });
    });

    describe('validateTreeTypeCompatibility', () => {
      it('returns true when nodes are compatible with candidate type', () => {
        const nodes: any[] = [
          { id: 1, name: 'Menu', nodeType: 'menu', status: 'pendingCreation', parent: null }
        ];
        component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes);

        const result = component['validateTreeTypeCompatibility']('touristic');

        expect(result).toBe(true);
      });

      it('returns false when nodes are incompatible with candidate type', () => {
        const nodes: any[] = [
          { id: 1, name: 'Menu', nodeType: 'menu', status: 'pendingCreation', parent: null }
        ];
        component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes);

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = component['validateTreeTypeCompatibility']('cartography');
        warnSpy.mockRestore();

        expect(result).toBe(false);
      });
    });

    describe('getTreeValidationErrorCode', () => {
      beforeEach(() => {
        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });
      });

      it('returns required when form is invalid', () => {
        component.entityForm.patchValue({ name: null });

        const result = (component as any).getTreeValidationErrorCode();

        expect(result).toBe('required');
      });

      it('returns treeStructure when structure validation fails', () => {
        component.currentTreeType = 'touristic';
        component.entityForm.patchValue({ name: 'Test', type: 'touristic' });
        component.treeNodesComponent.getNodesForValidation = jest.fn(() => [createTouristicRootWithMenu()] as any);

        const result = (component as any).getTreeValidationErrorCode();

        expect(result).toBe('treeStructure');
      });

      it('returns nodeType when node type validation fails', () => {
        component.currentTreeType = 'cartography';
        component.entityForm.patchValue({ name: 'Test', type: 'cartography' });
        const nodes = [
          { id: 1, name: 'Menu', nodeType: 'menu', children: [], status: 'pendingCreation', parent: null }
        ];
        component.treeNodesComponent.getNodesForValidation = jest.fn(() => nodes as any);

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const result = (component as any).getTreeValidationErrorCode();
        warnSpy.mockRestore();

        expect(result).toBe('nodeType');
      });

      it('returns null when all validations pass', () => {
        component.currentTreeType = 'touristic';
        component.entityForm.patchValue({ name: 'Test', type: 'touristic' });
        const rootNode = createTouristicRootNode({
          children: [
            { id: 1, name: 'Menu', nodeType: 'menu', status: 'pendingCreation', parent: null,
              children: [{ id: 2, name: 'Task', nodeType: 'task', children: [], status: 'pendingCreation', parent: 1 }] }
          ]
        });
        component.treeNodesComponent.getNodesForValidation = jest.fn(() => [rootNode] as any);

        const result = (component as any).getTreeValidationErrorCode();

        expect(result).toBeNull();
      });
    });

    describe('treeValidations with showErrors', () => {
      beforeEach(() => {
        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });
      });
      it('shows required fields error when showErrors is true and required validation fails', () => {
        component.entityForm.patchValue({ name: null });
        const showErrorSpy = jest.spyOn(component.utils, 'showRequiredFieldsError').mockImplementation(() => {});

        const result = component.treeValidations(true);

        expect(result).toBe(false);
        expect(showErrorSpy).toHaveBeenCalled();
        showErrorSpy.mockRestore();
      });

      it('shows tree structure error when showErrors is true and structure validation fails', () => {
        component.currentTreeType = 'touristic';
        component.entityForm.patchValue({ name: 'Test', type: 'touristic' });
        component.treeNodesComponent.getNodesForValidation = jest.fn(() => [createTouristicRootWithMenu()] as any);
        const showErrorSpy = jest.spyOn(component.utils, 'showTreeStructureError').mockImplementation(() => {});

        const result = component.treeValidations(true);

        expect(result).toBe(false);
        expect(showErrorSpy).toHaveBeenCalled();
        showErrorSpy.mockRestore();
      });

      it('returns false without showing errors when showErrors is false', () => {
        component.entityForm.patchValue({ name: null });
        const showErrorSpy = jest.spyOn(component.utils, 'showRequiredFieldsError').mockImplementation(() => {});

        const result = component.treeValidations(false);

        expect(result).toBe(false);
        expect(showErrorSpy).not.toHaveBeenCalled();
        showErrorSpy.mockRestore();
      });
    });
  });

  describe('Tree duplication save behavior (issue #392)', () => {
    describe('canSaveEntity in duplicate mode', () => {
      it('does not enable save when duplicate tree is loaded but nothing changed', () => {
        component.entityID = -1;
        component.duplicateID = 42;
        component.eagerLoadTreeStructure = true;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });
        component.entityForm.markAsPristine();

        assignTreeNodesStub(component, {
          hasUnsavedChanges: jest.fn(() => true),
          hasUnsavedChangesForToolbar: jest.fn(() => false),
          getNodesForValidation: jest.fn(() => [createTouristicRootNode()] as any),
        });

        expect(component.canSaveEntity).toBe(false);
      });

      it('enables save when duplicate tree has unsaved node changes', () => {
        component.entityID = -1;
        component.duplicateID = 42;
        component.eagerLoadTreeStructure = true;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });
        component.entityForm.markAsPristine();

        assignTreeNodesStub(component, {
          hasUnsavedChanges: jest.fn(() => true),
          hasUnsavedChangesForToolbar: jest.fn(() => true),
          getNodesForValidation: jest.fn(() => [createTouristicRootNode()] as any),
        });

        expect(component.canSaveEntity).toBe(true);
      });

      it('blocks save when duplicate tree data is not yet loaded', () => {
        component.entityID = -1;
        component.duplicateID = 42;
        component.eagerLoadTreeStructure = true;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });
        component.entityForm.markAsPristine();

        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });

        expect(component.canSaveEntity).toBe(false);
      });

      it('allows save for non-duplicate flows without tree data check', () => {
        component.entityID = 123;
        component.duplicateID = -1;
        component.eagerLoadTreeStructure = false;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });
        component.entityForm.markAsDirty();

        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });

        expect(component.canSaveEntity).toBe(true);
      });
    });

    describe('canSave matches canSaveEntity', () => {
      it('returns false when duplicate tree is ready but nothing changed', () => {
        component.eagerLoadTreeStructure = true;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });
        component.entityForm.markAsPristine();

        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => [createTouristicRootNode()] as any),
        });

        expect(component.canSave()).toBe(false);
        expect(component.canSave()).toBe(component.canSaveEntity);
      });

      it('returns false when duplicate tree data is not loaded', () => {
        component.eagerLoadTreeStructure = true;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });

        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });

        expect(component.canSave()).toBe(false);
        expect(component.canSave()).toBe(component.canSaveEntity);
      });

      it('returns true for non-duplicate flows when form has changes', () => {
        component.eagerLoadTreeStructure = false;
        component.entityForm.patchValue({ name: 'Test Tree', type: 'touristic' });
        component.entityForm.markAsDirty();

        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });

        expect(component.canSave()).toBe(true);
        expect(component.canSave()).toBe(component.canSaveEntity);
      });
    });

    describe('updateDataRelated with saveNodes', () => {
      it('invokes saveNodes when treeNodesComponent exists', async () => {
        const saveNodesSpy = jest.fn().mockResolvedValue(undefined);
        assignTreeNodesStub(component, {
          saveNodes: saveNodesSpy,
          getNodesForValidation: jest.fn(() => []),
        });

        component.entityID = 123;
        component.entityToEdit = new Tree();
        component.entityToEdit.id = 123;
        component.entityToEdit.name = 'Test Tree';

        await component.updateDataRelated(true);

        expect(saveNodesSpy).toHaveBeenCalledWith(component.entityToEdit, 123);
      });

      it('logs warning when treeNodesComponent is missing during duplication', async () => {
        const warnSpy = jest.spyOn(component['loggerService'], 'warn').mockImplementation(() => {});
        component.treeNodesComponent = undefined as any;
        component.entityID = 123;
        component.entityToEdit = new Tree();

        await component.updateDataRelated(true);

        expect(warnSpy).toHaveBeenCalledWith(
          'TreesFormComponent.updateDataRelated: treeNodesComponent missing during duplication; nodes were not saved.'
        );
        warnSpy.mockRestore();
      });

      it('does not log warning when treeNodesComponent is missing for non-duplicate', async () => {
        const warnSpy = jest.spyOn(component['loggerService'], 'warn').mockImplementation(() => {});
        component.treeNodesComponent = undefined as any;
        component.entityID = 123;
        component.entityToEdit = new Tree();

        await component.updateDataRelated(false);

        expect(warnSpy).not.toHaveBeenCalled();
        warnSpy.mockRestore();
      });
    });

    describe('isDuplicatedTreeReadyForSave', () => {
      it('returns true for non-eager flows', () => {
        component.eagerLoadTreeStructure = false;
        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });

        expect(component['isDuplicatedTreeReadyForSave']()).toBe(true);
      });

      it('returns true when eager tree has loaded nodes', () => {
        component.eagerLoadTreeStructure = true;
        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => [createTouristicRootNode()]),
        });

        expect(component['isDuplicatedTreeReadyForSave']()).toBe(true);
      });

      it('returns false when eager tree has no nodes yet', () => {
        component.eagerLoadTreeStructure = true;
        assignTreeNodesStub(component, {
          getNodesForValidation: jest.fn(() => []),
        });

        expect(component['isDuplicatedTreeReadyForSave']()).toBe(false);
      });

      it('returns false when treeNodesComponent is undefined in eager mode', () => {
        component.eagerLoadTreeStructure = true;
        component.treeNodesComponent = undefined as any;

        expect(component['isDuplicatedTreeReadyForSave']()).toBe(false);
      });
    });
  });

  describe('treeImageResizeHintParams$', () => {
    it('derives resize hint params from backend-provided default size', async () => {
      const params = await firstValueFrom(component.treeImageResizeHintParams$);
      expect(params).toEqual({ width: 125, height: 125, maxSizeMb: 2 });
    });
  });

  describe('treeImageAccept$', () => {
    it('derives file picker accepted extensions from backend-supported formats', async () => {
      await expect(firstValueFrom(component.treeImageAccept$)).resolves.toBe('.png,.jpg,.jpeg');
    });
  });

  describe('validateUniqueName', () => {
    beforeEach(() => {
      component.entityForm.patchValue({ name: 'Catalog Tree', type: 'touristic', description: 'desc' });
      component.entityID = 10;
    });

    it('returns true when search finds only the current tree', async () => {
      jest.spyOn(treeService, 'searchTextPage').mockReturnValue(of({
        rows: [{ id: 10, name: 'Catalog Tree' } as Tree],
        totalElements: 1,
        pageNumber: 0,
        pageSize: 20,
        totalPages: 1,
      }));

      expect(await (component as any).validateUniqueName()).toBe(true);
    });

    it('returns false and shows error when another tree has the same name', async () => {
      const errorHandler = TestBed.inject(ErrorHandlerService);
      const handleErrorSpy = jest.spyOn(errorHandler, 'handleError').mockReturnValue(null);
      jest.spyOn(treeService, 'searchTextPage').mockReturnValue(of({
        rows: [{ id: 99, name: 'Catalog Tree' } as Tree],
        totalElements: 1,
        pageNumber: 0,
        pageSize: 20,
        totalPages: 1,
      }));

      expect(await (component as any).validateUniqueName()).toBe(false);
      expect(handleErrorSpy).toHaveBeenCalledWith(null, 'entity.tree.error.duplicateName');
    });
  });

});

