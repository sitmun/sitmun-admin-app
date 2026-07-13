import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EMPTY, firstValueFrom, Observable, of } from 'rxjs';

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
import { AdminRuntimeConfigurationService } from '@app/domain/admin-configuration/services/admin-runtime-configuration.service';
import { DIALOG_EVENTS } from '@app/frontend-gui/src/lib/dialog-message/dialog-message.component';
import { SitmunFrontendGuiModule } from '@app/frontend-gui/src/lib/public_api';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { LoadingOverlayService } from '@app/services/loading-overlay.service';
import { LoggerService } from '@app/services/logger.service';
import { NotificationService } from '@app/services/notification.service';
import { UtilsService } from '@app/services/utils.service';
import { config } from '@config';
import { constants } from '@environments/constants';

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
            showDisplayOptionsPanel: true,
            capabilities: {
              radio: true,
            },
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

const ALL_NODE_TYPES = [
  { value: 'cartography', description: 'Cartography' },
  { value: 'folder', description: 'Folder' },
  { value: 'list', description: 'List' },
  { value: 'menu', description: 'Menu' },
  { value: 'task', description: 'Task' },
  { value: 'fav', description: 'Favorites' },
  { value: 'map', description: 'Map' },
  { value: 'nm', description: 'Near me' }
];

function flushTreeNodesHttpMocks(httpMock: HttpTestingController): void {
  httpMock.match((req) => req.url.includes('codelist-values')).forEach((req) =>
    req.flush({ _embedded: { 'codelist-values': [] } })
  );
  httpMock.match((req) => req.url.includes('cartographies')).forEach((req) =>
    req.flush({ _embedded: { cartographies: [] } })
  );
  httpMock.match((req) => req.url.includes('tasks')).forEach((req) =>
    req.flush({ _embedded: { tasks: [] } })
  );
  httpMock.match((req) => req.url.includes('translations')).forEach((req) =>
    req.flush({ _embedded: { translations: [] } })
  );
}

function mockDialogOpen(
  dialog: MatDialog,
  afterClosed: Observable<unknown> = of(undefined)
): jest.SpyInstance {
  return jest.spyOn(dialog, 'open').mockReturnValue({
    componentInstance: {},
    afterClosed: () => afterClosed
  } as any);
}

function setExistingFolderDetail(
  component: TreeNodesComponent,
  opts?: {
    dirty?: boolean;
    pristine?: boolean;
    nodeId?: number;
    name?: string;
    nodeType?: string;
    formPatch?: Record<string, unknown>;
  }
): void {
  const nodeId = opts?.nodeId ?? 5;
  component['currentNodeId'] = nodeId;
  component['newElement'] = false;
  component.treeNodeForm.patchValue({
    id: nodeId,
    name: opts?.name ?? 'Node',
    nodeType: opts?.nodeType ?? 'folder',
    ...opts?.formPatch,
  });
  if (opts?.dirty) {
    component.treeNodeForm.markAsDirty();
  }
  if (opts?.pristine) {
    component.treeNodeForm.markAsPristine();
  }
}

function mockSelectionDialog(
  event: typeof DIALOG_EVENTS.CANCEL | typeof DIALOG_EVENTS.ACCEPT
): jest.SpyInstance {
  return mockDialogOpen(TestBed.inject(MatDialog), of({ event }));
}

function nodeClickEvent(
  id: number,
  name = 'Node',
  nodeType = 'folder'
): { nodeClicked: { id: number; name: string; nodeType: string }; nodeParent: null } {
  return { nodeClicked: { id, name, nodeType }, nodeParent: null };
}

type PanelFlag = 'showMappingInTaskPanel' | 'showFilterableInTaskPanel';

const panelFlagGetters: Record<PanelFlag, (c: TreeNodesComponent) => boolean> = {
  showMappingInTaskPanel: (c) => c.showMappingInTaskPanel,
  showFilterableInTaskPanel: (c) => c.showFilterableInTaskPanel,
};

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: jest.SpyInstance;

  const setCodeList = (name: string, entries: any[]): void => {
    component['codelists'].set(name, entries as any);
    component['rebuildCodeListCaches']();
  };

  function setNodeContext(
    treeType: string,
    nodeType: string,
    opts?: {
      nodeId?: number;
      patchForm?: boolean;
      detectChanges?: boolean;
      formPatch?: Record<string, unknown>;
    }
  ): void {
    component.currentTreeType = treeType;
    component.currentNodeType = nodeType;
    if (opts?.nodeId !== undefined) {
      component['currentNodeId'] = opts.nodeId;
    }
    if (opts?.patchForm !== false) {
      component.treeNodeForm.patchValue({ nodeType, ...opts?.formPatch });
    }
    if (opts?.detectChanges) {
      fixture.detectChanges();
    }
  }

  function setTouristicTaskNode(opts?: {
    nodeId?: number;
    detectChanges?: boolean;
    formPatch?: Record<string, unknown>;
  }): void {
    setNodeContext('touristic', 'task', {
      nodeId: opts?.nodeId ?? 1,
      detectChanges: opts?.detectChanges,
      formPatch: opts?.formPatch,
    });
  }

  function setCartographyLeafNode(formPatch?: Record<string, unknown>): void {
    setNodeContext(constants.codeValue.treeType.cartography, constants.treeDomainKey.cartography, {
      formPatch,
    });
  }

  function setCartographyFolderNode(formPatch?: Record<string, unknown>): void {
    setNodeContext(constants.codeValue.treeType.cartography, constants.treeRenderType.folder, {
      formPatch,
    });
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
       
      teardown: { destroyAfterEach: 0 as any },
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
        MatSlideToggleModule,
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
        {
          provide: AdminRuntimeConfigurationService,
          useValue: { getTreeImageUploadConfiguration: () => of({ supportedFormats: ['png', 'jpg', 'jpeg'], maxBytes: 2_097_152, defaultSize: { width: 125, height: 125 }, sizesByType: { menu: { width: 50, height: 50 }, list: { width: 350, height: 350 } } }) }
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    httpMock = TestBed.inject(HttpTestingController);
    const logger = TestBed.inject(LoggerService);
    jest.spyOn(logger, 'debug').mockImplementation();
    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((r) => setTimeout(r, 0));
    flushTreeNodesHttpMocks(httpMock);
    await new Promise((r) => setTimeout(r, 0));
    flushTreeNodesHttpMocks(httpMock);
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    flushTreeNodesHttpMocks(httpMock);
    httpMock.verify();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => TestBed.resetTestingModule());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('treeNodeForm validation', () => {
    it('is invalid when empty', () => {
      expect(component.treeNodeForm.valid).toBeFalsy();
    });

    it('is invalid when name is missing', () => {
      component.treeNodeForm.patchValue({
        tooltip: true,
        cartography: null,
        radio: true,
        datasetURL: 'url',
        metadataURL: 'url',
        description: 'descript',
        active: true,
        order: 1,
        filterGetFeatureInfo: null,
        filterGetMap: null,
        filterSelectable: null,
        style: null,
        type: 'type',
        image: null,
        imageName: null,
        task: null,
        viewMode: null,
        filterable: false,
      });
      expect(component.treeNodeForm.valid).toBeFalsy();
    });

    it('is valid when required name is set', () => {
      component.treeNodeForm.patchValue({
        name: 'name',
        tooltip: true,
        cartography: null,
        radio: true,
        datasetURL: 'url',
        metadataURL: 'url',
        description: 'descript',
        active: true,
        order: 1,
        filterGetFeatureInfo: null,
        filterGetMap: null,
        filterSelectable: null,
        style: null,
      });
      expect(component.treeNodeForm.valid).toBeTruthy();
    });

    it('exposes expected form fields', () => {
      expect(component.treeNodeForm.get('name')).toBeTruthy();
      expect(component.treeNodeForm.get('tooltip')).toBeTruthy();
      expect(component.treeNodeForm.get('cartography')).toBeTruthy();
      expect(component.treeNodeForm.get('radio')).toBeTruthy();
      expect(component.treeNodeForm.get('datasetURL')).toBeTruthy();
      expect(component.treeNodeForm.get('metadataURL')).toBeTruthy();
      expect(component.treeNodeForm.get('description')).toBeTruthy();
      expect(component.treeNodeForm.get('visible')).toBeTruthy();
      expect(component.treeNodeForm.get('active')).toBeTruthy();
      expect(component.treeNodeForm.get('order')).toBeTruthy();
      expect(component.treeNodeForm.get('filterGetFeatureInfo')).toBeTruthy();
      expect(component.treeNodeForm.get('filterGetMap')).toBeTruthy();
      expect(component.treeNodeForm.get('filterSelectable')).toBeTruthy();
      expect(component.treeNodeForm.get('style')).toBeTruthy();
    });
  });

  describe('Node type codelist and filtering', () => {
    beforeEach(() => {
      setCodeList('treenode.node.type', ALL_NODE_TYPES as any);
    });

    it('should filter folder types for touristic tree', () => {
      component.currentTreeType = 'touristic';
      const values = component.getAvailableFolderTypes().map(t => t.value);
      expect(values).toContain('menu');
      expect(values).toContain('list');
      expect(values).not.toContain('cartography');
    });

    it('should filter leaf types for tree with task and cartography (testTree)', () => {
      component.currentTreeType = 'testTree';
      const values = component.getAvailableLeafTypes().map(t => t.value);
      expect(values).toContain('task');
      expect(values).toContain('cartography');
    });

    it('getNodeTypeLabel should resolve from treenode.node.type when present', () => {
      expect(component.getNodeTypeLabel('task')).toBe('Task');
      expect(component.getNodeTypeLabel('menu')).toBe('Menu');
    });

    it('should correctly identify leaf nodes', () => {
      component.currentTreeType = 'touristic';
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

  describe('showDescriptionMetadataPanel', () => {
    it('should be true for cartography leaf', () => {
      setCartographyLeafNode();
      expect(component.showDescriptionMetadataPanel).toBe(true);
    });

    it('should be true for cartography folder', () => {
      setCartographyFolderNode();
      expect(component.showDescriptionMetadataPanel).toBe(true);
    });

    it('should be true for list folder', () => {
      setNodeContext('touristic', 'list');
      expect(component.showDescriptionMetadataPanel).toBe(true);
    });

    it('should be false for task leaf', () => {
      setNodeContext('cartography', 'task');
      expect(component.showDescriptionMetadataPanel).toBe(false);
    });
  });

  describe('showAppearancePanel', () => {
    function setTouristicTaskUnderParent(parentNodeType: string | null): void {
      const parentId = 99;
      component.dataTree = {
        clearSelection: jest.fn(),
        setSelectionHighlight: jest.fn(),
        dataSource: {
          data: [{
            children: parentNodeType != null
              ? [{ id: parentId, nodeType: parentNodeType, children: [] }]
              : [],
          }],
        },
      } as any;
      setNodeContext('touristic', 'task', {
        formPatch: { parent: parentNodeType != null ? parentId : null },
      });
    }

    it('is true for touristic task under menu', () => {
      setTouristicTaskUnderParent('menu');
      expect(component.showAppearancePanel).toBe(true);
    });

    it('is true for touristic task under list (fix for issue #412)', () => {
      setTouristicTaskUnderParent('list');
      expect(component.showAppearancePanel).toBe(true);
    });

    it('is false for touristic task without a parent', () => {
      setTouristicTaskUnderParent(null);
      expect(component.showAppearancePanel).toBe(false);
    });

    it('is true for touristic list node (unconditional showAppearancePanel)', () => {
      setNodeContext('touristic', 'list');
      expect(component.showAppearancePanel).toBe(true);
    });

    it('is false for touristic task under an unrelated parent type', () => {
      setTouristicTaskUnderParent('task');
      expect(component.showAppearancePanel).toBe(false);
    });
  });

  describe('task panel config flags', () => {
    it.each<[PanelFlag, string, string, boolean]>([
      ['showMappingInTaskPanel', 'touristic', 'task', true],
      ['showMappingInTaskPanel', 'cartography', 'cartography', false],
      ['showFilterableInTaskPanel', 'touristic', 'task', true],
      ['showFilterableInTaskPanel', 'cartography', 'cartography', false],
    ])('%s is %s for %s + %s', (flag, treeType, nodeType, expected) => {
      setNodeContext(treeType, nodeType);
      expect(panelFlagGetters[flag](component)).toBe(expected);
    });

    it('showMappingInTaskPanel should be true for testTree + task when mock has showMappingInTaskPanel', () => {
      setNodeContext('testTree', 'task');
      expect(component.showMappingInTaskPanel).toBe(true);
    });
  });

  describe('getViewModeLabelForTree', () => {
    it('returns description when viewMode is in codelist', () => {
      setCodeList('treenode.viewmode', [
        { value: 'dl', description: 'Detailed list' },
        { value: 'rt', description: 'Routes' }
      ] as any);
      expect(component.getViewModeLabelForTree('dl')).toBe('Detailed list');
      expect(component.getViewModeLabelForTree('rt')).toBe('Routes');
    });

    it('returns raw viewMode when not in codelist', () => {
      setCodeList('treenode.viewmode', [{ value: 'dl', description: 'Detailed list' }] as any);
      expect(component.getViewModeLabelForTree('unknown')).toBe('unknown');
    });

    it('returns empty string for empty viewMode', () => {
      expect(component.getViewModeLabelForTree('')).toBe('');
    });
  });

  describe('Task Configuration panel template visibility', () => {
    it('shows mapping mode and action row when showMappingInTaskPanel is true', () => {
      setTouristicTaskNode({ detectChanges: true });
      const modeAndAction = fixture.nativeElement.querySelector('.task-config-mode-and-action');
      expect(modeAndAction).toBeTruthy();
      expect(modeAndAction?.querySelector('mat-form-field')).toBeTruthy();
      expect(modeAndAction?.querySelector('button')).toBeTruthy();
    });

    it('does not show mapping action row when task panel is not shown', () => {
      setNodeContext('cartography', 'cartography', { nodeId: 1, detectChanges: true });
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

    it('enables task selection when guidance comes from currentNodeTask but task control is not hydrated', () => {
      component.treeNodeForm.patchValue({
        nodeType: 'task',
        task: null,
        taskId: 42,
        taskName: 'Layer query',
      });
      component['currentNodeTask'] = {
        id: 42,
        name: 'Layer query',
        properties: {
          parameters: [{ name: 'layer', label: 'layer' }],
        },
      } as any;

      expect(component.taskInputParameterLabels).toContain('layer');
      expect(component.hasTaskSelected).toBe(true);
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
      setNodeContext('testTree', 'task', { nodeId: 1, detectChanges: true });
      const guidance = fixture.nativeElement.querySelector('.task-config-guidance');
      expect(guidance).toBeTruthy();
      expect(guidance?.querySelector('.task-config-guidance-intro')).toBeTruthy();
    });

    it('guidance block shows input empty state when no task', () => {
      setNodeContext('testTree', 'task', { nodeId: 1, formPatch: { task: null }, detectChanges: true });
      const emptyEl = fixture.nativeElement.querySelector('.task-config-guidance-empty');
      expect(emptyEl).toBeTruthy();
    });
  });

  describe('default type fallback from config', () => {
    beforeEach(() => {
      setCodeList('treenode.node.type', [
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
      setCodeList('treenode.node.type', [
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
      setCodeList('treenode.node.type', [] as any);
      component.currentTreeType = 'cartography';
      component.currentNodeType = 'task';
      component.treeNodeForm.patchValue({ nodeType: 'task' });
      component.onTreeNodeTypeChange('invalid');
      expect(component.treeNodeForm.get('nodeType')?.value).toBe('task');
    });
  });

  describe('Node creation and form visibility', () => {
    const mockParent = { id: 1, name: 'Parent', children: [] } as any;

    function startNewFolderNode(type = 'menu'): void {
      component.currentTreeType = 'cartography';
      component.addNodeWithType(mockParent, type);
    }

    describe('Node creation with fictitious IDs', () => {
      it('should patch fictitious id when creating a folder node', () => {
        const initialCounter = component['idFictitiousCounter'];
        startNewFolderNode('menu');

        expect(component.treeNodeForm.get('id')?.value).toBe(initialCounter);
        expect(component['currentNodeId']).toBe(initialCounter);
        expect(component.treeNodeForm.get('nodeType')?.value).toBe('menu');
        expect(component.treeNodeForm.get('status')?.value).toBe('pendingCreation');
      });

      it('should patch fictitious id when creating a leaf node', () => {
        const initialCounter = component['idFictitiousCounter'];
        startNewFolderNode('list');

        expect(component.treeNodeForm.get('id')?.value).toBe(initialCounter);
        expect(component['currentNodeId']).toBe(initialCounter);
      });

      it('should emit node with fictitious id when saving new node', () => {
        const initialCounter = component['idFictitiousCounter'];
        startNewFolderNode('menu');
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
        startNewFolderNode('menu');
        component.treeNodeForm.patchValue({ name: 'New Folder' });

        component['updateTreeLeft']();

        expect(component['idFictitiousCounter']).toBe(initialCounter - 1);
      });

      it('should assign unique fictitious ids to multiple new nodes', () => {
        const ids: number[] = [];
        startNewFolderNode('menu');
        ids.push(component.treeNodeForm.get('id')?.value);
        component['updateTreeLeft']();

        startNewFolderNode('list');
        ids.push(component.treeNodeForm.get('id')?.value);
        component['updateTreeLeft']();

        startNewFolderNode('menu');
        ids.push(component.treeNodeForm.get('id')?.value);

        expect(ids[0]).toBe(-1);
        expect(ids[1]).toBe(-2);
        expect(ids[2]).toBe(-3);
        expect(new Set(ids).size).toBe(3);
      });
    });

    describe('Form visibility after node creation', () => {
      it('should clear currentNodeId after creating new node', () => {
        startNewFolderNode('menu');
        component.treeNodeForm.patchValue({ name: 'New Folder' });

        expect(component['currentNodeId']).not.toBeNull();

        component['updateTreeLeft']();

        expect(component['currentNodeId']).toBeNull();
      });

      it('should hide form after creating new node (hasNodeSelection = false)', () => {
        startNewFolderNode('menu');
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
        startNewFolderNode('menu');
        component.treeNodeForm.patchValue({ name: 'New Folder' });

        component['updateTreeLeft']();

        expect(component.treeNodeForm.get('name')?.value).toBeNull();
        expect(component.treeNodeForm.get('id')?.value).toBeNull();
        expect(component['currentNodeType']).toBeNull();
      });

      it('expands tree to full width when no node is selected', () => {
        component['treePanelWidth'] = 45;
        component['currentNodeId'] = 5;
        expect(component.effectiveTreePanelWidth).toBe(45);

        component['currentNodeId'] = null;
        component['newElement'] = false;
        expect(component.hasNodeSelection).toBe(false);
        expect(component.effectiveTreePanelWidth).toBe(100);
      });
    });
  });

  describe('save order normalization', () => {
    it('normalizes sibling order preserving current tree sequence', () => {
      const siblings: any[] = [
        { id: 10, order: 4, status: constants.entityStatus.modified, children: [] },
        { id: -1, order: null, status: constants.entityStatus.pendingCreation, children: [] },
        { id: 20, order: 0, status: constants.entityStatus.modified, children: [] }
      ];

      (component as any).normalizeSiblingOrderForSave(siblings);

      expect(siblings.map((n) => n.order)).toEqual([0, 1, 2]);
    });
  });

  describe('Input mapping field configuration', () => {
    const widthTaskMock = {
      id: 99,
      properties: {
        parameters: [{ name: 'width', label: 'Width', value: '256' }]
      }
    };

    async function openFieldsConfigWithMapping(mapping: { output: object; input: object }): Promise<void> {
      component.currentTreeType = 'testTree';
      component.currentViewMode = 'dl';
      component.treeNodeForm.patchValue({ taskId: 99, mapping });
      const taskService = TestBed.inject(TaskService);
      jest.spyOn(taskService, 'get').mockReturnValue(of(widthTaskMock as any));
      mockDialogOpen(TestBed.inject(MatDialog), EMPTY);
      await component.openFieldsConfigDialog();
    }

    it('formatTaskParameterDefaultForInput returns empty for null and undefined', () => {
      expect(component.formatTaskParameterDefaultForInput(null)).toBe('');
      expect(component.formatTaskParameterDefaultForInput(undefined)).toBe('');
    });

    it('formatTaskParameterDefaultForInput stringifies primitives and JSON', () => {
      expect(component.formatTaskParameterDefaultForInput('x')).toBe('x');
      expect(component.formatTaskParameterDefaultForInput(42)).toBe('42');
      expect(component.formatTaskParameterDefaultForInput(false)).toBe('false');
      expect(component.formatTaskParameterDefaultForInput({ a: 1 })).toBe('{"a":1}');
    });

    it('openFieldsConfigDialog prefills input from task parameter default when mapping key is absent', async () => {
      await openFieldsConfigWithMapping({ output: {}, input: {} });
      expect(component.fieldsConfigForm.get('input.width')?.get('value')?.value).toBe('256');
    });

    it('openFieldsConfigDialog does not prefill when saved mapping has explicit key with null value', async () => {
      await openFieldsConfigWithMapping({
        output: {},
        input: { width: { value: null, calculated: false } }
      });
      expect(component.fieldsConfigForm.get('input.width')?.get('value')?.value).toBe('');
    });
  });

  describe('Tree node task type filtering (query + edit)', () => {
    it('getAllTasks merges query and edit lists from two fetchAllItems calls and dedupes by id', async () => {
      const taskService: TaskService = TestBed.inject(TaskService);
      jest.spyOn(taskService, 'fetchAllItems').mockImplementation((opts: { params?: { key: string; value: number }[] }) => {
        const typeId = opts?.params?.find((p) => p.key === 'type.id')?.value;
        if (typeId === config.tasksTypes.query) {
          return of([{ id: 1, name: 'Query task', typeId: config.tasksTypes.query }]);
        }
        if (typeId === config.tasksTypes.edit) {
          return of([
            { id: 2, name: 'Edit task', typeId: config.tasksTypes.edit },
            { id: 1, name: 'Duplicate id', typeId: config.tasksTypes.edit }
          ]);
        }
        return of([]);
      });

      const merged = await firstValueFrom(component.getAllTasks());

      expect(taskService.fetchAllItems).toHaveBeenCalledTimes(2);
      expect(merged.map((t: { id: number }) => t.id)).toEqual([1, 2]);
    });

    it('isAllowedTreeNodeTaskType allows query, edit, listed allTasks ids, and nested type.id', () => {
      component.allTasks = [{ id: 10, name: 'Listed', typeId: config.tasksTypes.query }];
      expect((component as any).isAllowedTreeNodeTaskType({ id: 10, typeId: config.tasksTypes.basic })).toBe(true);
      expect((component as any).isAllowedTreeNodeTaskType({ id: 99, typeId: config.tasksTypes.query })).toBe(true);
      expect((component as any).isAllowedTreeNodeTaskType({ id: 100, typeId: config.tasksTypes.edit })).toBe(true);
      expect((component as any).isAllowedTreeNodeTaskType({ id: 101, typeId: config.tasksTypes.basic })).toBe(false);
      expect((component as any).isAllowedTreeNodeTaskType({ id: 102, type: { id: config.tasksTypes.query } })).toBe(true);
    });

    it('resolveTaskTypeId reads typeId and nested type.id', () => {
      expect((component as any).resolveTaskTypeId({ typeId: 5 })).toBe(5);
      expect((component as any).resolveTaskTypeId({ type: { id: 0 } })).toBe(0);
      expect((component as any).resolveTaskTypeId({})).toBeNull();
    });
  });

  describe('cartography selection requirements', () => {
    let dialogOpenSpy: jest.SpyInstance;
    let updateCartographySpy: jest.SpyInstance;

    beforeEach(() => {
      dialogOpenSpy = mockDialogOpen(component.dialog);
      updateCartographySpy = jest.spyOn(component, 'updateCartographyTreeLeft').mockResolvedValue(undefined);
      component['currentNodeId'] = 1;
    });

    describe('requiresCartographySelection', () => {
      it.each<[string, string, boolean]>([
        [constants.codeValue.treeType.cartography, constants.treeDomainKey.cartography, true],
        [constants.codeValue.treeType.cartography, constants.treeRenderType.folder, false],
        [constants.codeValue.treeType.touristicTree, constants.treeDomainKey.task, false],
        [constants.codeValue.treeType.edition, constants.treeDomainKey.cartography, false],
      ])('returns %s for %s + %s', (treeType, nodeType, expected) => {
        setNodeContext(treeType, nodeType);
        expect((component as any).requiresCartographySelection()).toBe(expected);
      });
    });

    describe('getSelectedRowsCartographies', () => {
      it('shows error when leaf has no cartography on cartography tree', async () => {
        setCartographyLeafNode({ cartographyName: null });

        await component.getSelectedRowsCartographies([]);

        expect(dialogOpenSpy).toHaveBeenCalled();
        expect(updateCartographySpy).not.toHaveBeenCalled();
      });

      it('does not show error for touristic task nodes without cartography', async () => {
        setNodeContext(constants.codeValue.treeType.touristicTree, constants.treeDomainKey.task, {
          formPatch: { cartographyName: null },
        });

        await component.getSelectedRowsCartographies([]);

        expect(dialogOpenSpy).not.toHaveBeenCalled();
      });

      it('updates cartography when grid returns a selection', async () => {
        setCartographyLeafNode();
        const selected = { id: 2, name: 'Selected layer', stylesNames: [] };

        await component.getSelectedRowsCartographies([selected]);

        expect(dialogOpenSpy).not.toHaveBeenCalled();
        expect(updateCartographySpy).toHaveBeenCalledWith(selected);
      });
    });

    describe('onCartographySelected', () => {
      it('updates form when a cartography is selected', async () => {
        setCartographyLeafNode();
        const selected = { id: 1, name: 'Layer A', stylesNames: [] };

        await component.onCartographySelected({ option: { value: selected } } as any);

        expect(updateCartographySpy).toHaveBeenCalledWith(selected);
        expect(dialogOpenSpy).not.toHaveBeenCalled();
      });

      it('blocks clearing cartography when required for the node type', async () => {
        const existing = { id: 5, name: 'Existing layer' };
        setCartographyLeafNode({
          cartographyName: 'Existing layer',
          cartography: existing,
          oldCartography: existing,
        });

        await component.onCartographySelected({ option: { value: null } } as any);

        expect(dialogOpenSpy).toHaveBeenCalled();
        expect(updateCartographySpy).not.toHaveBeenCalled();
        expect(component.treeNodeForm.get('cartography')?.value).toEqual(existing);
      });

      it('allows clearing cartography on touristic task nodes', async () => {
        setNodeContext(constants.codeValue.treeType.touristicTree, constants.treeDomainKey.task, {
          formPatch: {
            cartographyName: 'Old layer',
            cartography: { id: 1, name: 'Old layer' },
          },
        });

        await component.onCartographySelected({ option: { value: null } } as any);

        expect(dialogOpenSpy).not.toHaveBeenCalled();
        expect(updateCartographySpy).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('fields config response tree', () => {
    let dialogOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      dialogOpenSpy = mockDialogOpen(component.dialog);
    });

    it('parseInput returns false and shows dialog when textarea is empty', () => {
      expect(component.parseInput('')).toBe(false);
      expect(component.parseInput('   ')).toBe(false);
      expect(component.parsedData.data).toEqual({});
      expect(dialogOpenSpy).toHaveBeenCalled();
    });

    it('parseInput returns false for malformed JSON', () => {
      expect(component.parseInput('{not json')).toBe(false);
      expect(component.fieldsConfigTreeGenerated).toBe(false);
    });

    it('parseInput returns false when JSON root is a primitive', () => {
      expect(component.parseInput('"hello"')).toBe(false);
      expect(component.parseInput('42')).toBe(false);
    });

    it('parseInput returns true for JSON object and populates parsedData', () => {
      const ok = component.parseInput('{"features":[{"id":1,"name":"Test"}]}');

      expect(ok).toBe(true);
      expect(component.parsedData.dataType).toBe('json');
      expect(component.parsedData.data).toEqual({ features: [{ id: 1, name: 'Test' }] });
    });

    it('parseInput returns true for XML object root', () => {
      const ok = component.parseInput('<root><id>1</id></root>');

      expect(ok).toBe(true);
      expect(component.parsedData.dataType).toBe('xml');
      expect(component.parsedData.data).toEqual({ root: { id: 1 } });
    });

    it('generateFieldsConfigTree only reveals tree after successful parse', () => {
      component.fieldsConfigForm.patchValue({ taskResponse: '' });
      component.generateFieldsConfigTree();
      expect(component.fieldsConfigTreeGenerated).toBe(false);

      component.fieldsConfigForm.patchValue({ taskResponse: '{"id":1}' });
      component.generateFieldsConfigTree();
      expect(component.fieldsConfigTreeGenerated).toBe(true);
    });

    it('hideFieldsConfigTree keeps parsedData but hides the tree', () => {
      component.parseInput('{"id":1}');
      component.fieldsConfigTreeGenerated = true;

      component.hideFieldsConfigTree();

      expect(component.fieldsConfigTreeGenerated).toBe(false);
      expect(component.parsedData.data).toEqual({ id: 1 });
    });
  });

  describe('related entity links', () => {
    it('builds cartography form link from cartographyId', () => {
      setNodeContext('testTree', 'cartography', {
        formPatch: { cartographyId: 42 },
      });
      expect(component.getCartographyFormLink()).toEqual(['/layers', 42, 'layersForm']);
    });

    it('returns null cartography link when no cartography is selected', () => {
      setNodeContext('testTree', 'cartography', {
        formPatch: { cartographyId: null },
      });
      expect(component.getCartographyFormLink()).toBeNull();
    });

    it('builds task query form link for query tasks', () => {
      setNodeContext('testTree', 'task', {
        formPatch: {
          taskId: 7,
          task: { id: 7, typeId: config.tasksTypes.query },
        },
      });
      expect(component.getTaskFormLink()).toEqual(['/taskQuery', 7, config.tasksTypes.query]);
    });

    it('builds task edit form link for edit tasks', () => {
      setNodeContext('testTree', 'task', {
        formPatch: {
          taskId: 8,
          task: { id: 8, typeId: config.tasksTypes.edit },
        },
      });
      expect(component.getTaskFormLink()).toEqual(['/taskEdit', 8, config.tasksTypes.edit]);
    });

    it('builds cartography link for list item id', () => {
      expect(component.getCartographyFormLinkForId(99)).toEqual(['/layers', 99, 'layersForm']);
      expect(component.getCartographyFormLinkForId(null)).toBeNull();
    });

    it('builds task link for list item', () => {
      expect(component.getTaskFormLinkForTask({ id: 3, typeId: config.tasksTypes.query }))
        .toEqual(['/taskQuery', 3, config.tasksTypes.query]);
      expect(component.getTaskFormLinkForTask({ id: 4, typeId: config.tasksTypes.basic })).toBeNull();
    });
  });

  describe('selection UX', () => {
    beforeEach(() => {
      component.dataTree = { clearSelection: jest.fn(), setSelectionHighlight: jest.fn() } as any;
    });

    it('hasUnsavedDetailChanges reflects dirty existing node', () => {
      setExistingFolderDetail(component);
      expect(component.hasUnsavedDetailChanges()).toBe(false);

      component.treeNodeForm.markAsDirty();
      expect(component.hasUnsavedDetailChanges()).toBe(true);
    });

    it('hasUnsavedDetailChanges ignores tree metadata flags on pristine form', () => {
      setExistingFolderDetail(component, {
        formPatch: {
          nameFormModified: true,
          descriptionFormModified: true,
        },
        pristine: true,
      });

      expect(component.hasUnsavedDetailChanges()).toBe(false);
    });

    it('hasUnsavedDetailChanges is true for pendingCreation tree node', () => {
      component.dataTree = {
        clearSelection: jest.fn(),
        setSelectionHighlight: jest.fn(),
        dataSource: {
          data: [{
            children: [{ id: -2, name: 'New', status: constants.entityStatus.pendingCreation, nodeType: 'folder' }],
          }],
        },
      } as any;
      component['currentNodeId'] = -2;
      component['newElement'] = false;
      component.treeNodeForm.patchValue({ id: -2, name: 'New', nodeType: 'folder' });
      component.treeNodeForm.markAsPristine();

      expect(component.hasUnsavedDetailChanges()).toBe(true);
    });

    it('hasUnsavedDetailChanges reflects create mode with name filled', () => {
      component['newElement'] = true;
      component['currentNodeId'] = -1;
      component.treeNodeForm.patchValue({ name: 'New node', nodeType: 'folder' });
      expect(component.hasUnsavedDetailChanges()).toBe(true);
    });

    it('canSaveNodeDetail is false when there are no changes', () => {
      setExistingFolderDetail(component);
      expect(component.canSaveNodeDetail).toBe(false);
    });

    it('canSaveNodeDetail is true when edit form is dirty and valid', () => {
      setExistingFolderDetail(component, { dirty: true });
      expect(component.canSaveNodeDetail).toBe(true);
    });

    it('clears selection when closing pristine detail', async () => {
      setExistingFolderDetail(component);

      await component.onCloseDetailClicked();

      expect(component['currentNodeId']).toBeNull();
      expect(component.hasNodeSelection).toBe(false);
      expect(component.dataTree.clearSelection).toHaveBeenCalled();
    });

    it('keeps selection when closing dirty detail and canceling confirm', async () => {
      setExistingFolderDetail(component, { dirty: true });
      mockSelectionDialog(DIALOG_EVENTS.CANCEL);

      await component.onCloseDetailClicked();

      expect(component['currentNodeId']).toBe(5);
      expect(component.hasNodeSelection).toBe(true);
    });

    it('clears selection when closing dirty detail and confirming discard', async () => {
      setExistingFolderDetail(component, { dirty: true });
      mockSelectionDialog(DIALOG_EVENTS.ACCEPT);

      await component.onCloseDetailClicked();

      expect(component['currentNodeId']).toBeNull();
      expect(component.dataTree.clearSelection).toHaveBeenCalled();
    });

    it('shows snackbar on second click of same dirty node', async () => {
      const notification = TestBed.inject(NotificationService);
      const showInfoSpy = jest.spyOn(notification, 'showInfo').mockImplementation();
      setExistingFolderDetail(component, { dirty: true });

      await component.nodeReceived(nodeClickEvent(5));

      expect(showInfoSpy).toHaveBeenCalledWith('entity.tree.saveBeforeDeselect', '');
      expect(component['currentNodeId']).toBe(5);
    });

    it('clears selection on second click of same pristine node', async () => {
      setExistingFolderDetail(component);

      await component.nodeReceived(nodeClickEvent(5));

      expect(component['currentNodeId']).toBeNull();
      expect(component.dataTree.clearSelection).toHaveBeenCalled();
    });

    it('loads different node when switch confirm is accepted', async () => {
      setExistingFolderDetail(component, { dirty: true });
      mockSelectionDialog(DIALOG_EVENTS.ACCEPT);
      const loadSpy = jest.spyOn(component as any, 'loadNodeDetail').mockResolvedValue(undefined);

      await component.nodeReceived(nodeClickEvent(10, 'Other'));

      expect(loadSpy).toHaveBeenCalled();
    });

    it('cancels switch when confirm is rejected', async () => {
      setExistingFolderDetail(component, { dirty: true });
      mockSelectionDialog(DIALOG_EVENTS.CANCEL);
      const loadSpy = jest.spyOn(component as any, 'loadNodeDetail').mockResolvedValue(undefined);

      await component.nodeReceived(nodeClickEvent(10, 'Other'));

      expect(loadSpy).not.toHaveBeenCalled();
      expect(component['currentNodeId']).toBe(5);
      expect(component.dataTree.setSelectionHighlight).toHaveBeenCalledWith(5);
    });

    it('gates addNodeWithType when detail has unsaved changes', async () => {
      setExistingFolderDetail(component, { dirty: true });
      mockSelectionDialog(DIALOG_EVENTS.CANCEL);

      await component.addNodeWithType(null, 'folder');

      expect(component['newElement']).toBe(false);
      expect(component['currentNodeId']).toBe(5);
    });

    it('shows snackbar on Escape when detail is dirty', () => {
      const notification = TestBed.inject(NotificationService);
      const showInfoSpy = jest.spyOn(notification, 'showInfo').mockImplementation();
      setExistingFolderDetail(component, { dirty: true });

      component.onDocumentEscape(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(showInfoSpy).toHaveBeenCalledWith('entity.tree.saveBeforeDeselect', '');
      expect(component['currentNodeId']).toBe(5);
    });
  });

  describe('nodeImageResizeHintParams$', () => {
    let parentTypeSpy: jest.SpyInstance;

    beforeEach(() => {
      parentTypeSpy = jest.spyOn(component, 'currentParentNodeType', 'get');
    });

    afterEach(() => {
      parentTypeSpy.mockRestore();
    });

    it('returns default size when no parent type is set', async () => {
      parentTypeSpy.mockReturnValue(null);
      expect(await firstValueFrom(component.nodeImageResizeHintParams$)).toEqual({ width: 125, height: 125, maxSizeMb: 2 });
    });

    it('returns menu size when parent type is menu', async () => {
      parentTypeSpy.mockReturnValue('menu');
      expect(await firstValueFrom(component.nodeImageResizeHintParams$)).toEqual({ width: 50, height: 50, maxSizeMb: 2 });
    });

    it('returns list size when parent type is list', async () => {
      parentTypeSpy.mockReturnValue('list');
      expect(await firstValueFrom(component.nodeImageResizeHintParams$)).toEqual({ width: 350, height: 350, maxSizeMb: 2 });
    });

    it('returns default size for unknown parent type', async () => {
      parentTypeSpy.mockReturnValue('unknown');
      expect(await firstValueFrom(component.nodeImageResizeHintParams$)).toEqual({ width: 125, height: 125, maxSizeMb: 2 });
    });
  });

  describe('nodeImageAccept$', () => {
    it('derives file picker accepted extensions from backend-supported formats', async () => {
      await expect(firstValueFrom(component.nodeImageAccept$)).resolves.toBe('.png,.jpg,.jpeg');
    });
  });

  describe('visible and load-by-default toggles', () => {
    beforeEach(() => {
      component.currentTreeType = 'testTree';
      component.treeNodeForm.patchValue({
        nodeType: constants.treeDomainKey.cartography,
        cartographyId: 42,
        visible: true,
        active: false,
      });
      component['currentNodeType'] = constants.treeDomainKey.cartography;
      fixture.detectChanges();
    });

    it('shows load-by-default toggle only for cartography leaves', () => {
      expect(component.showLoadByDefaultToggle).toBe(true);
      component.treeNodeForm.patchValue({ nodeType: constants.treeDomainKey.task });
      component['currentNodeType'] = constants.treeDomainKey.task;
      expect(component.showLoadByDefaultToggle).toBe(false);
    });

    it('clears active when visible becomes false', () => {
      component.treeNodeForm.patchValue({ active: true });
      component.treeNodeForm.get('visible')?.setValue(false);
      expect(component.treeNodeForm.getRawValue().active).toBe(false);
    });
  });

  describe('radio toggle', () => {
    it('shows radio toggle only for folders on cartography trees', () => {
      component.currentTreeType = 'cartography';
      component['currentNodeType'] = constants.treeRenderType.folder;
      component.treeNodeForm.patchValue({ nodeType: constants.treeRenderType.folder });
      expect(component.showRadioToggle).toBe(true);

      component.currentTreeType = 'touristic';
      expect(component.showRadioToggle).toBe(false);
    });
  });

  describe('TNO radio and active remediation', () => {
    function mockCartographyTree(children: any[] = []): void {
      component.currentTreeType = constants.codeValue.treeType.cartography;
      component.dataTree = {
        clearSelection: jest.fn(),
        setSelectionHighlight: jest.fn(),
        originalNodeStates: new Map<string | number, any>(),
        dataSource: {
          data: [{
            children,
          }],
        },
      } as any;
    }

    function cartographyLeaf(id: number, parent: number, active = false): any {
      return {
        id,
        parent,
        name: `Layer ${id}`,
        nodeType: constants.treeDomainKey.cartography,
        cartographyId: id * 10,
        children: [],
        visible: true,
        active,
      };
    }

    function radioFolder(id: number, children: any[] = []): any {
      return {
        id,
        parent: null,
        name: `Radio ${id}`,
        nodeType: constants.treeRenderType.folder,
        radio: true,
        children,
        visible: true,
        active: false,
      };
    }

    describe('resolvePersistedActive', () => {
      it('returns true only for visible cartography leaves with active true', () => {
        const resolve = (component as any).resolvePersistedActive.bind(component);
        expect(resolve({
          visible: true,
          active: true,
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 1,
        })).toBe(true);
        expect(resolve({
          visible: false,
          active: true,
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 1,
        })).toBe(false);
        expect(resolve({
          visible: true,
          active: true,
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: null,
        })).toBe(false);
        expect(resolve({
          visible: true,
          active: false,
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 1,
        })).toBe(false);
      });

      it('returns false when cartography leaf also has a task relation', () => {
        const resolve = (component as any).resolvePersistedActive.bind(component);
        expect(resolve({
          visible: true,
          active: true,
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 1,
          taskId: 99,
        })).toBe(false);
      });
    });

    describe('addNodeWithType control sync', () => {
      it('disables active for non-cartography leaf types immediately after opening the form', async () => {
        mockCartographyTree([]);
        await component.addNodeWithType({ id: 1, name: 'Parent', children: [] } as any, 'folder');
        expect(component.treeNodeForm.get('active')?.disabled).toBe(true);
        expect(component.treeNodeForm.getRawValue().active).toBe(false);
      });
    });

    describe('nodeReceived projection patch', () => {
      it('patches visible and active independently from projection values', async () => {
        mockCartographyTree([
          cartographyLeaf(4, null, false),
        ]);
        await component.nodeReceived({
          nodeClicked: {
            id: 4,
            name: 'Layer',
            nodeType: constants.treeDomainKey.cartography,
            cartographyId: 40,
            visible: true,
            active: false,
            parent: null,
            children: [],
          },
          nodeParent: null,
        });
        flushTreeNodesHttpMocks(TestBed.inject(HttpTestingController));
        expect(component.treeNodeForm.getRawValue().visible).toBe(true);
        expect(component.treeNodeForm.getRawValue().active).toBe(false);
      });
    });

    describe('capability-positive synthetic tree radio', () => {
      it('exposes radio toggle for folder nodes when tree capability is enabled', () => {
        component.currentTreeType = 'testTree';
        component['currentNodeType'] = constants.treeRenderType.folder;
        component.treeNodeForm.patchValue({ nodeType: constants.treeRenderType.folder });
        expect(component.showRadioToggle).toBe(true);
      });
    });

    describe('resolvePersistedRadio', () => {
      it('returns true only for radio-capable folders whose direct children are cartography leaves', () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const resolve = (component as any).resolvePersistedRadio.bind(component);
        expect(resolve({
          nodeType: constants.treeRenderType.folder,
          radio: true,
          children: [cartographyLeaf(2, 1)],
        })).toBe(true);
        expect(resolve({
          nodeType: constants.treeRenderType.folder,
          radio: true,
          children: [{ id: 3, nodeType: constants.treeRenderType.folder, children: [] }],
        })).toBe(false);
        expect(resolve({
          nodeType: constants.treeDomainKey.cartography,
          radio: true,
          cartographyId: 1,
          children: [],
        })).toBe(false);
        component.currentTreeType = 'touristic';
        expect(resolve({
          nodeType: constants.treeRenderType.folder,
          radio: true,
          children: [],
        })).toBe(false);
      });
    });

    describe('updateNode normalization', () => {
      beforeEach(() => {
        setCodeList('treenode.node.type', [
          { value: 'folder', description: 'Folder' },
          { value: 'cartography', description: 'Cartography' },
        ] as any);
      });

      it('normalizes active and radio before emitting tree update', () => {
        mockCartographyTree([
          radioFolder(1, [cartographyLeaf(2, 1, true)]),
        ]);
        component['currentNodeId'] = 1;
        component['newElement'] = false;
        component['currentNodeType'] = constants.treeRenderType.folder;
        component.treeNodeForm.patchValue({
          id: 1,
          name: 'Radio folder',
          nodeType: constants.treeRenderType.folder,
          visible: true,
          active: true,
          radio: true,
        });
        component.treeNodeForm.markAsDirty();

        const updates: any[] = [];
        component.sendNodeUpdated.subscribe((node) => updates.push(node));
        component.updateNode();

        expect(updates).toHaveLength(1);
        expect(updates[0].active).toBe(false);
        expect(updates[0].radio).toBe(true);
      });

      it('clears stale radio when node type changes to leaf', () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        component['currentNodeId'] = 8;
        component['newElement'] = false;
        component['currentNodeType'] = constants.treeDomainKey.cartography;
        component.treeNodeForm.patchValue({
          id: 8,
          name: 'Leaf',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 5,
          visible: true,
          active: true,
          radio: true,
        });
        component.treeNodeForm.markAsDirty();
        const updates: any[] = [];
        component.sendNodeUpdated.subscribe((node) => updates.push(node));

        component.onTreeNodeTypeChange(constants.treeDomainKey.cartography);

        expect(component.treeNodeForm.get('radio')?.disabled).toBe(true);
        expect(component.treeNodeForm.getRawValue().radio).toBe(false);
        expect(updates.at(-1)?.radio).toBe(false);
        expect(updates.at(-1)?.active).toBe(true);
      });
    });

    describe('radio control guards', () => {
      it('disables radio when a direct child is not a cartography leaf', () => {
        mockCartographyTree([
          {
            id: 1,
            nodeType: constants.treeRenderType.folder,
            radio: false,
            children: [{ id: 2, nodeType: constants.treeRenderType.folder, children: [] }],
          },
        ]);
        component['currentNodeId'] = 1;
        component['currentNodeType'] = constants.treeRenderType.folder;
        component.treeNodeForm.patchValue({
          id: 1,
          nodeType: constants.treeRenderType.folder,
          radio: true,
        });

        (component as any).syncFormControlsDisabledState();

        expect(component.treeNodeForm.get('radio')?.disabled).toBe(true);
        expect(component.treeNodeForm.getRawValue().radio).toBe(false);
      });

      it('clears active when cartography relation is missing', () => {
        setCartographyLeafNode({ cartographyId: null, active: true, visible: true });
        (component as any).syncFormControlsDisabledState();
        expect(component.treeNodeForm.getRawValue().active).toBe(false);
        expect(component.treeNodeForm.get('active')?.disabled).toBe(true);
      });
    });

    describe('radio sibling exclusivity', () => {
      it('deactivates direct sibling and marks it Modified without touching nested descendants', () => {
        const nested = cartographyLeaf(99, 2, true);
        const childA = { ...cartographyLeaf(2, 1, true), children: [nested] };
        const childB = cartographyLeaf(3, 1, false);
        mockCartographyTree([radioFolder(1, [childA, childB])]);

        component['currentNodeId'] = 3;
        component['currentNodeType'] = constants.treeDomainKey.cartography;
        component.treeNodeForm.patchValue({
          id: 3,
          parent: 1,
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 30,
          active: true,
        });
        component.treeNodeForm.markAsDirty();

        const updates: any[] = [];
        component.sendNodeUpdated.subscribe((node) => updates.push(node));
        component.treeNodeForm.get('active')?.setValue(true);

        const siblingUpdate = updates.find((node) => node.id === 2);
        expect(siblingUpdate?.active).toBe(false);
        expect(siblingUpdate?.status).toBe(constants.entityStatus.modified);
        expect(nested.active).toBe(true);
      });
    });

    describe('clearExcessRadioDefaultsOnEnable', () => {
      it('clears all defaults when radio enabled with two active children', () => {
        const childA = cartographyLeaf(2, 1, true);
        const childB = cartographyLeaf(3, 1, true);
        mockCartographyTree([radioFolder(1, [childA, childB])]);

        component['currentNodeId'] = 1;
        component['currentNodeType'] = constants.treeRenderType.folder;
        component.treeNodeForm.patchValue({
          id: 1,
          parent: null,
          nodeType: constants.treeRenderType.folder,
          radio: false,
        });

        const updates: any[] = [];
        component.sendNodeUpdated.subscribe((node) => updates.push(node));

        component.treeNodeForm.get('radio')?.setValue(true);

        const cleared = updates.filter((node) => node.active === false && (node.id === 2 || node.id === 3));
        expect(cleared).toHaveLength(2);
        expect(cleared.map((node) => node.id)).toEqual(expect.arrayContaining([2, 3]));
      });

      it('keeps single default when radio enabled with one active child', () => {
        const childA = cartographyLeaf(2, 1, true);
        const childB = cartographyLeaf(3, 1, false);
        mockCartographyTree([radioFolder(1, [childA, childB])]);

        component['currentNodeId'] = 1;
        component['currentNodeType'] = constants.treeRenderType.folder;
        component.treeNodeForm.patchValue({
          id: 1,
          parent: null,
          nodeType: constants.treeRenderType.folder,
          radio: false,
        });

        const updates: any[] = [];
        component.sendNodeUpdated.subscribe((node) => updates.push(node));

        component.treeNodeForm.get('radio')?.setValue(true);

        const cleared = updates.filter((node) => node.active === false && (node.id === 2 || node.id === 3));
        expect(cleared).toHaveLength(0);
      });

      it('no-op when radio enabled with no active children', () => {
        const childA = cartographyLeaf(2, 1, false);
        const childB = cartographyLeaf(3, 1, false);
        mockCartographyTree([radioFolder(1, [childA, childB])]);

        component['currentNodeId'] = 1;
        component['currentNodeType'] = constants.treeRenderType.folder;
        component.treeNodeForm.patchValue({
          id: 1,
          parent: null,
          nodeType: constants.treeRenderType.folder,
          radio: false,
        });

        const updates: any[] = [];
        component.sendNodeUpdated.subscribe((node) => updates.push(node));

        component.treeNodeForm.get('radio')?.setValue(true);

        const cleared = updates.filter((node) => node.active === false && (node.id === 2 || node.id === 3));
        expect(cleared).toHaveLength(0);
      });
    });

    describe('updateAllTreeNodes save ordering', () => {
      function mockDeferredSave(treeNodeService: TreeNodeService): {
        release: (id: number) => void;
        saveStarted: number[];
      } {
        const pending = new Map<number, () => void>();
        const saveStarted: number[] = [];
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          saveStarted.push(node.id);
          if (node.id === 2) {
            return new Observable((subscriber) => {
              pending.set(2, () => {
                subscriber.next({ ...node, id: node.id } as any);
                subscriber.complete();
              });
            });
          }
          return of({ ...node, id: node.id } as any);
        });
        return {
          release: (id: number) => pending.get(id)?.(),
          saveStarted,
        };
      }

      it('awaits sibling deactivations before activations under a radio parent', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        const saveOrder: number[] = [];
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          saveOrder.push(node.id);
          return of({ ...node, id: node.id } as any);
        });

        const siblingA = {
          id: 2,
          parent: 1,
          name: 'A',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 20,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
        };
        const siblingB = {
          id: 3,
          parent: 1,
          name: 'B',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 30,
          status: constants.entityStatus.modified,
          visible: true,
          active: true,
          order: 1,
        };
        const parentFolder = {
          id: 1,
          parent: null,
          name: 'Radio',
          nodeType: constants.treeRenderType.folder,
          radio: true,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
          children: [siblingA, siblingB],
        };
        const unrelated = {
          id: 10,
          parent: null,
          name: 'Other',
          nodeType: constants.treeRenderType.folder,
          radio: false,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 1,
        };

        mockCartographyTree([radioFolder(1, [cartographyLeaf(2, 1), cartographyLeaf(3, 1, true)])]);
        component.dataTree.originalNodeStates = new Map([
          [2, { id: 2, active: true, visible: true }],
          [3, { id: 3, active: false, visible: true }],
        ]);

        await (component as any).updateAllTreeNodes(
          [parentFolder, siblingA, siblingB, unrelated],
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        const deactivateIndex = saveOrder.indexOf(2);
        const activateIndex = saveOrder.indexOf(3);
        expect(deactivateIndex).toBeGreaterThanOrEqual(0);
        expect(activateIndex).toBeGreaterThan(deactivateIndex);
      });

      it('does not start activation save until deactivation save completes', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        const { release, saveStarted } = mockDeferredSave(treeNodeService);

        const siblingA = {
          id: 2,
          parent: 1,
          name: 'A',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 20,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
        };
        const siblingB = {
          id: 3,
          parent: 1,
          name: 'B',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 30,
          status: constants.entityStatus.modified,
          visible: true,
          active: true,
          order: 1,
        };

        mockCartographyTree([radioFolder(1, [cartographyLeaf(2, 1, true), cartographyLeaf(3, 1)])]);
        component.dataTree.originalNodeStates = new Map([
          [2, { id: 2, active: true, visible: true }],
          [3, { id: 3, active: false, visible: true }],
        ]);

        const savePromise = (component as any).updateAllTreeNodes(
          [siblingA, siblingB],
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        await Promise.resolve();
        expect(saveStarted).toEqual([2]);
        expect(saveStarted).not.toContain(3);

        release(2);
        await savePromise;
        expect(saveStarted).toEqual([2, 3]);
      });

      it('serializes dual-active malformed sibling saves under one radio parent', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        let concurrent = 0;
        let maxConcurrent = 0;
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          concurrent += 1;
          maxConcurrent = Math.max(maxConcurrent, concurrent);
          return new Observable((subscriber) => {
            setTimeout(() => {
              concurrent -= 1;
              subscriber.next({ ...node, id: node.id } as any);
              subscriber.complete();
            }, 0);
          });
        });

        const siblingA = {
          id: 2,
          parent: 1,
          name: 'A',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 20,
          status: constants.entityStatus.modified,
          visible: true,
          active: true,
          order: 0,
        };
        const siblingB = {
          id: 3,
          parent: 1,
          name: 'B',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 30,
          status: constants.entityStatus.modified,
          visible: true,
          active: true,
          order: 1,
        };
        const parentFolder = {
          id: 1,
          parent: null,
          name: 'Radio',
          nodeType: constants.treeRenderType.folder,
          radio: true,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
          children: [siblingA, siblingB],
        };

        mockCartographyTree([radioFolder(1, [cartographyLeaf(2, 1, true), cartographyLeaf(3, 1, true)])]);
        component.dataTree.originalNodeStates = new Map([
          [2, { id: 2, active: true, visible: true }],
          [3, { id: 3, active: true, visible: true }],
        ]);

        await (component as any).updateAllTreeNodes(
          [parentFolder, siblingA, siblingB],
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        expect(maxConcurrent).toBe(1);
      });

      it('skips radio phasing when parent radio flag is stale and structure is invalid', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        const saveOrder: number[] = [];
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          saveOrder.push(node.id);
          return of({ ...node, id: node.id } as any);
        });

        const invalidRadioParent = {
          id: 1,
          parent: null,
          name: 'Invalid radio',
          nodeType: constants.treeRenderType.folder,
          radio: true,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
          children: [{ id: 9, nodeType: constants.treeRenderType.folder, children: [] }],
        };
        const leaf = {
          id: 9,
          parent: 1,
          name: 'Folder child',
          nodeType: constants.treeRenderType.folder,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
        };

        mockCartographyTree([invalidRadioParent]);

        await (component as any).updateAllTreeNodes(
          [invalidRadioParent, leaf],
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        expect(saveOrder.sort()).toEqual([1, 9]);
      });

      it('reconciles out-of-order save results by node id', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          const delay = node.id === 11 ? 20 : 0;
          return new Observable((subscriber) => {
            setTimeout(() => {
              subscriber.next({ ...node, id: node.id, name: `saved-${node.id}` } as any);
              subscriber.complete();
            }, delay);
          });
        });

        const nodes = [
          {
            id: 10,
            parent: null,
            name: 'Fast',
            nodeType: constants.treeRenderType.folder,
            radio: false,
            status: constants.entityStatus.modified,
            visible: true,
            active: false,
            order: 0,
          },
          {
            id: 11,
            parent: null,
            name: 'Slow',
            nodeType: constants.treeRenderType.folder,
            radio: false,
            status: constants.entityStatus.modified,
            visible: true,
            active: false,
            order: 1,
          },
        ];

        mockCartographyTree([]);

        await (component as any).updateAllTreeNodes(
          nodes,
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        expect(nodes.find((node) => node.id === 10)?.name).toBe('saved-10');
        expect(nodes.find((node) => node.id === 11)?.name).toBe('saved-11');
      });

      it('persists radio via resolvePersistedRadio not raw treeNode.radio', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        const saved: any[] = [];
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          saved.push(node);
          return of({ ...node } as any);
        });

        const staleRadioFolder = {
          id: 5,
          parent: null,
          name: 'Stale radio',
          nodeType: constants.treeDomainKey.task,
          radio: true,
          status: constants.entityStatus.modified,
          visible: true,
          active: false,
          order: 0,
        };

        await (component as any).updateAllTreeNodes(
          [staleRadioFolder],
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        expect(saved[0].radio).toBe(false);
      });
    });

    describe('panel expansion state', () => {
      it('defaults to basic-info only on first node selection', () => {
        expect(component.isPanelExpanded('basic-info')).toBe(true);
        expect(component.isPanelExpanded('display-options')).toBe(false);
        expect(component.isPanelExpanded('description-metadata')).toBe(false);
        expect(component.isPanelExpanded('cartography-config')).toBe(false);
      });

      it('keeps expanded panels across node switch', () => {
        component['currentNodeId'] = 1;
        component.onPanelStateChange('display-options', true);
        expect(component.isPanelExpanded('display-options')).toBe(true);

        // Simulate switching to node 2 (spurious closed event fires with old panel state)
        component['currentNodeId'] = 2;

        expect(component.isPanelExpanded('display-options')).toBe(true);
      });

      it('does not clear expansion when switching nodes without user closing', () => {
        component['currentNodeId'] = 1;
        component.onPanelStateChange('description-metadata', true);

        // Node switch without user explicitly closing the panel
        component['currentNodeId'] = 2;

        expect(component.isPanelExpanded('description-metadata')).toBe(true);
      });

      it('newly visible panel starts collapsed when user has not expanded it', () => {
        // cartography-config panel has never been expanded
        expect(component.isPanelExpanded('cartography-config')).toBe(false);
      });

      it('collapses panel globally after user closes it', () => {
        component.onPanelStateChange('display-options', true);
        expect(component.isPanelExpanded('display-options')).toBe(true);

        component.onPanelStateChange('display-options', false);
        expect(component.isPanelExpanded('display-options')).toBe(false);

        component['currentNodeId'] = 99;
        expect(component.isPanelExpanded('display-options')).toBe(false);
      });
    });

    describe('save payload fields', () => {
      it('builds visible and active on TreeNode without loadByDefault', async () => {
        component.currentTreeType = constants.codeValue.treeType.cartography;
        const treeNodeService = TestBed.inject(TreeNodeService);
        let captured: any;
        jest.spyOn(treeNodeService, 'save').mockImplementation((node: any) => {
          captured = node;
          return of({ ...node } as any);
        });

        const leaf = {
          id: 7,
          parent: null,
          name: 'Leaf',
          nodeType: constants.treeDomainKey.cartography,
          cartographyId: 70,
          status: constants.entityStatus.modified,
          visible: false,
          active: true,
          order: 0,
        };

        await (component as any).updateAllTreeNodes(
          [leaf],
          0,
          new Map(),
          [],
          null,
          null,
          { id: 1 } as any,
          1
        );

        expect(captured.visible).toBe(false);
        expect(captured.active).toBe(false);
        expect(captured).not.toHaveProperty('loadByDefault');
      });
    });
  });

});
