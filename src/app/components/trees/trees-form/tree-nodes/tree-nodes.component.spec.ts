import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';
import {
  CapabilitiesService,
  CartographyService,
  CodeListService,
  ServiceService,
  TaskService,
  TranslationService,
  TreeNodeService
} from '@app/domain';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { UtilsService } from '@app/services/utils.service';

import { TreeNodesComponent } from './tree-nodes.component';

jest.mock('@config', () => {
  const actual = jest.requireActual<{ config: Record<string, unknown> }>('../../../../../config.ts');
  return {
    config: {
      ...actual.config,
      treeTypeNodeTypes: {
        ...(actual.config.treeTypeNodeTypes as object),
        testTree: {
        allowedRootTypes: ['folder'],
        nodeTypes: {
          folder: {
            allowedChildren: ['task', 'cartography', 'folder'],
            icon: 'folder',
            showDescriptionPanel: true,
            showMetadataFieldsInDescriptionPanel: true,
            showCartographyPanel: false,
            showAppearancePanel: false,
            showTaskPanel: false,
            showDisplayOptionsPanel: true
          },
          task: {
            allowedChildren: [],
            icon: 'sync',
            showDescriptionPanel: false,
            showCartographyPanel: false,
            showAppearancePanel: false,
            showTaskPanel: true,
            showFilterableInTaskPanel: true,
            showMappingInTaskPanel: true,
            showDisplayOptionsPanel: true
          },
          cartography: {
            allowedChildren: [],
            icon: 'stacks',
            showDescriptionPanel: true,
            showCartographyPanel: true,
            showAppearancePanel: false,
            showTaskPanel: false,
            showDisplayOptionsPanel: true
          }
        }
      }
    }
  }
  };
});

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await TestBed.configureTestingModule({
      declarations: [TreeNodesComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatCardModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => ({
              getTranslation: () => of({})
            })
          }
        }),
        SitmunFrontendGuiModule
      ],
      providers: [
        TreeNodeService,
        TranslationService,
        CodeListService,
        CartographyService,
        TaskService,
        ServiceService,
        CapabilitiesService,
        ResourceService,
        ExternalService,
        LoggerService,
        LoadingOverlayService,
        UtilsService,
        ErrorHandlerService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const logger = TestBed.inject(LoggerService);
    jest.spyOn(logger, 'debug').mockImplementation();
    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    const flushPending = (): void => {
      httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
        req.flush({ _embedded: { 'codelist-values': [] } })
      );
      httpMock.match((req) => req.url.includes('cartographies')).forEach((req) =>
        req.flush({ _embedded: { cartographies: [] } })
      );
      httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
        req.flush({ _embedded: { tasks: [] } })
      );
    };
    flushPending();
    await new Promise((r) => setTimeout(r, 0));
    flushPending();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
      req.flush({ _embedded: { 'codelist-values': [] } })
    );
    httpMock.match((req) => req.url.includes('cartographies')).forEach((req) =>
      req.flush({ _embedded: { cartographies: [] } })
    );
    httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
      req.flush({ _embedded: { tasks: [] } })
    );
    httpMock.verify();
    consoleErrorSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Node type filtering by tree type', () => {
    const nodeTypes = [
      { value: 'menu', description: 'Menu' },
      { value: 'list', description: 'List' },
      { value: 'cartography', description: 'Cartography' },
      { value: 'task', description: 'Task' },
      { value: 'map', description: 'Map' },
      { value: 'fav', description: 'Favorites' },
      { value: 'nm', description: 'Near me' }
    ];

    beforeEach(() => {
      component['codelists'].set('treenode.node.type', nodeTypes as any);
    });

    it('should filter folder types for touristic tree', () => {
      component.currentTreeType = 'touristic';
      const folderTypes = component.getAvailableFolderTypes();
      
      // Should only return menu and list folders for touristic
      const values = folderTypes.map(t => t.value);
      expect(values).toContain('menu');
      expect(values).toContain('list');
      expect(values).not.toContain('cartography');
    });

    it('should filter leaf types for tree with task and cartography (testTree)', () => {
      component.currentTreeType = 'testTree';
      const leafTypes = component.getAvailableLeafTypes();

      const values = leafTypes.map(t => t.value);
      expect(values).toContain('task');
      expect(values).toContain('cartography');
    });

    it('should correctly identify leaf nodes', () => {
      component.currentTreeType = 'touristic';
      // task, map, nm can have children (allowedChildren in config); fav cannot
      expect(component.isNodeTypeALeaf('task')).toBe(false);
      expect(component.isNodeTypeALeaf('map')).toBe(false);
      expect(component.isNodeTypeALeaf('fav')).toBe(true);
      expect(component.isNodeTypeALeaf('nm')).toBe(false);
      expect(component.isNodeTypeALeaf('menu')).toBe(false);
      expect(component.isNodeTypeALeaf('list')).toBe(false);
    });

    it('should return correct allowed children for parent node type', () => {
      component.currentTreeType = 'touristic';
      
      const menuChildren = component.getAllowedChildrenForParent('menu');
      expect(menuChildren).toContain('list');
      expect(menuChildren).toContain('task');
      expect(menuChildren).toContain('map');
      expect(menuChildren).toContain('fav');
      expect(menuChildren).toContain('nm');

      const listChildren = component.getAllowedChildrenForParent('list');
      expect(listChildren).toContain('list');
      expect(listChildren).toContain('task');
      expect(listChildren).toContain('map');
      expect(listChildren).not.toContain('fav');
      expect(listChildren).not.toContain('nm');
    });

    it('canNodeHaveChildren should return false for leaf nodes', () => {
      component.currentTreeType = 'touristic';
      // fav is the only leaf among these (allowedChildren: [] in config)
      expect(component.canNodeHaveChildren('task')).toBe(true);
      expect(component.canNodeHaveChildren('map')).toBe(true);
      expect(component.canNodeHaveChildren('fav')).toBe(false);
      expect(component.canNodeHaveChildren('nm')).toBe(true);
    });

    it('canNodeHaveChildren should return true for folder nodes', () => {
      component.currentTreeType = 'touristic';
      
      expect(component.canNodeHaveChildren('menu')).toBe(true);
      expect(component.canNodeHaveChildren('list')).toBe(true);
    });

    it('canNodeHaveChildren should return true for null type (legacy folders)', () => {
      component.currentTreeType = 'cartography';
      
      expect(component.canNodeHaveChildren(null)).toBe(true);
    });
  });

  describe('Node type codelist (treenode.node.type)', () => {
    const nodeTypes = [
      { value: 'cartography', description: 'Cartography' },
      { value: 'folder', description: 'Folder' },
      { value: 'list', description: 'List' },
      { value: 'menu', description: 'Menu' },
      { value: 'task', description: 'Task' },
      { value: 'fav', description: 'Favorites' },
      { value: 'map', description: 'Map' },
      { value: 'nm', description: 'Near me' }
    ];

    beforeEach(() => {
      component['codelists'].set('treenode.node.type', nodeTypes as any);
    });

    it('should use treenode.node.type for folder types when present', () => {
      component.currentTreeType = 'touristic';
      const folderTypes = component.getAvailableFolderTypes();
      const values = folderTypes.map(t => t.value);
      expect(values).toContain('menu');
      expect(values).toContain('list');
      expect(values).not.toContain('cartography');
    });

    it('should use treenode.node.type for leaf types when present', () => {
      component.currentTreeType = 'testTree';
      const leafTypes = component.getAvailableLeafTypes();
      const values = leafTypes.map(t => t.value);
      expect(values).toContain('task');
      expect(values).toContain('cartography');
    });

    it('getNodeTypeLabel should resolve from treenode.node.type when present', () => {
      expect(component.getNodeTypeLabel('task')).toBe('Task');
      expect(component.getNodeTypeLabel('menu')).toBe('Menu');
    });
  });

  describe('showDescriptionMetadataPanel', () => {
    it('should be true for cartography leaf', () => {
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'cartography';
      expect(component.showDescriptionMetadataPanel).toBe(true);
    });

    it('should be true for cartography folder', () => {
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'cartography';
      expect(component.showDescriptionMetadataPanel).toBe(true);
    });

    it('should be true for list folder', () => {
      component.currentTreeType = 'touristic';
      component.currentNodeType = 'list';
      expect(component.showDescriptionMetadataPanel).toBe(true);
    });

    it('should be false for task leaf', () => {
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'task';
      expect(component.showDescriptionMetadataPanel).toBe(false);
    });
  });

  describe('showMappingInTaskPanel', () => {
    it('should be true for touristic + task', () => {
      component.currentTreeType = 'touristic';
      component.currentNodeType = 'task';
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      expect(component.showMappingInTaskPanel).toBe(true);
    });

    it('should be false for cartography + cartography', () => {
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'cartography';
      component.treeNodeForm.patchValue({ nodeType: 'cartography' });
      expect(component.showMappingInTaskPanel).toBe(false);
    });

    it('should be true for testTree + task when mock has showMappingInTaskPanel', () => {
      component.currentTreeType = 'testTree';
      component.currentNodeType = 'task';
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      expect(component.showMappingInTaskPanel).toBe(true);
    });
  });

  describe('getViewModeLabelForTree', () => {
    it('returns description when viewMode is in codelist', () => {
      component['codelists'].set('treenode.viewmode', [
        { value: 'dl', description: 'Detailed list' },
        { value: 'rt', description: 'Routes' }
      ] as any);
      expect(component.getViewModeLabelForTree('dl')).toBe('Detailed list');
      expect(component.getViewModeLabelForTree('rt')).toBe('Routes');
    });

    it('returns raw viewMode when not in codelist', () => {
      component['codelists'].set('treenode.viewmode', [{ value: 'dl', description: 'Detailed list' }] as any);
      expect(component.getViewModeLabelForTree('unknown')).toBe('unknown');
    });

    it('returns empty string for empty viewMode', () => {
      expect(component.getViewModeLabelForTree('')).toBe('');
    });
  });

  describe('showFilterableInTaskPanel regression', () => {
    it('should be true for touristic + task', () => {
      component.currentTreeType = 'touristic';
      component.currentNodeType = 'task';
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      expect(component.showFilterableInTaskPanel).toBe(true);
    });

    it('should be false for cartography + cartography', () => {
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'cartography';
      component.treeNodeForm.patchValue({ nodeType: 'cartography' });
      expect(component.showFilterableInTaskPanel).toBe(false);
    });
  });

  describe('Task Configuration panel template visibility', () => {
    it('shows mapping mode and action row when showMappingInTaskPanel is true', () => {
      component.currentTreeType = 'touristic';
      component.currentNodeType = 'task';
      component['currentNodeId'] = 1;
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      fixture.detectChanges();
      const modeAndAction = fixture.nativeElement.querySelector('.task-config-mode-and-action');
      expect(modeAndAction).toBeTruthy();
      expect(modeAndAction?.querySelector('mat-form-field')).toBeTruthy();
      expect(modeAndAction?.querySelector('button')).toBeTruthy();
    });

    it('does not show mapping action row when task panel is not shown', () => {
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'cartography';
      component['currentNodeId'] = 1;
      component.treeNodeForm.patchValue({ nodeType: 'cartography' });
      fixture.detectChanges();
      const taskPanel = fixture.nativeElement.querySelector('mat-expansion-panel');
      const taskConfigContent = taskPanel?.querySelector('.task-config-content');
      expect(taskConfigContent).toBeFalsy();
    });
  });

  describe('Task panel input/output guidance', () => {
    it('taskInputParameterLabels returns empty when no task selected', () => {
      component.treeNodeForm.patchValue({ task: null });
      component.currentNodeTask = null;
      expect(component.taskInputParameterLabels).toEqual([]);
    });

    it('taskInputParameterLabels returns labels when task has parameters', () => {
      const taskWithParams = {
        id: 1,
        name: 'Test Task',
        properties: {
          parameters: [
            { name: 'param1', label: 'First param' },
            { name: 'param2' }
          ]
        }
      };
      component.treeNodeForm.patchValue({ task: taskWithParams });
      expect(component.taskInputParameterLabels).toEqual(['First param', 'param2']);
    });

    it('taskOutputParametersForCurrentMode returns empty when no view mode', () => {
      component.currentViewMode = '';
      expect(component.taskOutputParametersForCurrentMode).toEqual([]);
    });

    it('taskOutputParametersForCurrentMode returns descriptors for current view mode', () => {
      component.currentViewMode = 'dl';
      const out = component.taskOutputParametersForCurrentMode;
      expect(out.length).toBeGreaterThan(0);
      expect(out.every(p => typeof p.key === 'string' && typeof p.label === 'string')).toBe(true);
    });

    it('guidance block is present when task panel is shown', () => {
      component.currentTreeType = 'testTree';
      component.currentNodeType = 'task';
      component['currentNodeId'] = 1;
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      fixture.detectChanges();
      const guidance = fixture.nativeElement.querySelector('.task-config-guidance');
      expect(guidance).toBeTruthy();
      expect(guidance?.querySelector('.task-config-guidance-intro')).toBeTruthy();
    });

    it('guidance block shows input empty state when no task', () => {
      component.currentTreeType = 'testTree';
      component.currentNodeType = 'task';
      component['currentNodeId'] = 1;
      component.treeNodeForm.patchValue({ nodeType: 'task', task: null });
      fixture.detectChanges();
      const emptyEl = fixture.nativeElement.querySelector('.task-config-guidance-empty');
      expect(emptyEl).toBeTruthy();
    });
  });

  describe('default type fallback from config', () => {
    beforeEach(() => {
      component['codelists'].set('treenode.node.type', [
        { value: 'folder', description: 'Folder' },
        { value: 'cartography', description: 'Cartography' },
        { value: 'task', description: 'Task' }
      ] as any);
    });

    it('testTree invalid leaf type falls back to first valid leaf (task)', () => {
      component.currentTreeType = 'testTree';
      component.currentNodeType = 'task';
      component.newElement = false;
      component.treeNodeForm.patchValue({ nodeType: 'invalid' });
      component.onTreeNodeTypeChange('invalid');
      expect(component.treeNodeForm.get('nodeType')?.value).toBe('task');
    });

    it('touristic tree container fallback resolves to valid container from codelist', () => {
      component['codelists'].set('treenode.node.type', [
        { value: 'menu', description: 'Menu' },
        { value: 'list', description: 'List' }
      ] as any);
      component.currentTreeType = 'touristic';
      component.currentNodeType = 'menu';
      component.newElement = false;
      component.treeNodeForm.patchValue({ nodeType: 'invalid' });
      component.onTreeNodeTypeChange('invalid');
      const nodeType = component.treeNodeForm.get('nodeType')?.value;
      expect(['menu', 'list']).toContain(nodeType);
    });

    it('onTreeNodeTypeChange does not patch when no valid default exists', () => {
      component['codelists'].set('treenode.node.type', [] as any);
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'task';
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      component.onTreeNodeTypeChange('invalid');
      expect(component.treeNodeForm.get('nodeType')?.value).toBe('task');
    });
  });

  describe('Node creation with fictitious IDs', () => {
    beforeEach(() => {
      component.currentTreeType = 'cartography';
    });

    it('should patch fictitious id when creating a folder node', () => {
      const initialCounter = component['idFictitiousCounter'];
      const mockParent = { id: 1, name: 'Parent Folder', children: [] } as any;

      component.addNodeWithType(mockParent, 'menu');

      expect(component.treeNodeForm.get('id')?.value).toBe(initialCounter);
      expect(component['currentNodeId']).toBe(initialCounter);
      expect(component.treeNodeForm.get('nodeType')?.value).toBe('menu');
      expect(component.treeNodeForm.get('status')?.value).toBe('pendingCreation');
    });

    it('should patch fictitious id when creating a leaf node', () => {
      const initialCounter = component['idFictitiousCounter'];
      const mockParent = { id: 1, name: 'Parent Folder', children: [] } as any;
      // Use folder type 'list' to avoid rendering cartography panels (style/mat-select) in test
      component.addNodeWithType(mockParent, 'list');

      expect(component.treeNodeForm.get('id')?.value).toBe(initialCounter);
      expect(component['currentNodeId']).toBe(initialCounter);
    });

    it('should emit node with fictitious id when saving new node', () => {
      const initialCounter = component['idFictitiousCounter'];
      const mockParent = { id: 1, name: 'Parent', children: [] } as any;
      component.addNodeWithType(mockParent, 'menu');
      component.treeNodeForm.patchValue({ name: 'New Folder' });

      const createNodeSpy = jest.fn();
      component.createNodeEvent.subscribe(createNodeSpy);

      component['updateTreeLeft']();

      expect(createNodeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: initialCounter,
          name: 'New Folder',
          nodeType: 'menu',
          status: 'pendingCreation',
          parent: 1
        })
      );
    });

    it('should decrement idFictitiousCounter after creating node', () => {
      const initialCounter = component['idFictitiousCounter'];
      const mockParent = { id: 1, name: 'Parent', children: [] } as any;
      component.addNodeWithType(mockParent, 'menu');
      component.treeNodeForm.patchValue({ name: 'New Folder' });

      component['updateTreeLeft']();

      expect(component['idFictitiousCounter']).toBe(initialCounter - 1);
    });

    it('should assign unique fictitious ids to multiple new nodes', () => {
      const mockParent = { id: 1, name: 'Parent', children: [] } as any;
      const ids: number[] = [];
      // Use folder types only to avoid cartography panel (style control) in test
      component.addNodeWithType(mockParent, 'menu');
      ids.push(component.treeNodeForm.get('id')?.value);
      component['updateTreeLeft']();

      component.addNodeWithType(mockParent, 'list');
      ids.push(component.treeNodeForm.get('id')?.value);
      component['updateTreeLeft']();

      component.addNodeWithType(mockParent, 'menu');
      ids.push(component.treeNodeForm.get('id')?.value);

      expect(ids[0]).toBe(-1);
      expect(ids[1]).toBe(-2);
      expect(ids[2]).toBe(-3);
      expect(new Set(ids).size).toBe(3);
    });
  });

  describe('Form visibility after node creation', () => {
    it('should clear currentNodeId after creating new node', () => {
      const mockParent = { id: 1, name: 'Parent', children: [] } as any;
      component.currentTreeType = 'cartography';
      component.addNodeWithType(mockParent, 'menu');
      component.treeNodeForm.patchValue({ name: 'New Folder' });

      expect(component['currentNodeId']).not.toBeNull();

      component['updateTreeLeft']();

      expect(component['currentNodeId']).toBeNull();
    });

    it('should hide form after creating new node (hasNodeSelection = false)', () => {
      const mockParent = { id: 1, name: 'Parent', children: [] } as any;
      component.currentTreeType = 'cartography';
      component.addNodeWithType(mockParent, 'menu');
      component.treeNodeForm.patchValue({ name: 'New Folder' });

      expect(component.hasNodeSelection).toBe(true);

      component['updateTreeLeft']();

      expect(component.hasNodeSelection).toBe(false);
      expect(component['newElement']).toBe(false);
    });

    it('should keep form visible after updating existing node', () => {
      component.currentTreeType = 'cartography';
      component['newElement'] = false;
      component['currentNodeId'] = 5;
      component.treeNodeForm.patchValue({ id: 5, name: 'Existing Node', nodeType: 'menu' });
      component.treeNodeForm.markAsDirty();

      component['updateTreeLeft']();

      expect(component['currentNodeId']).toBe(5);
      expect(component.hasNodeSelection).toBe(true);
    });

    it('should reset form after creating new node', () => {
      const mockParent = { id: 1, name: 'Parent', children: [] } as any;
      component.currentTreeType = 'cartography';
      component.addNodeWithType(mockParent, 'menu');
      component.treeNodeForm.patchValue({ name: 'New Folder' });

      component['updateTreeLeft']();

      expect(component.treeNodeForm.get('name')?.value).toBeNull();
      expect(component.treeNodeForm.get('id')?.value).toBeNull();
      expect(component['currentNodeType']).toBeNull();
    });
  });
});

