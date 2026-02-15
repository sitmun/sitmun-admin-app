import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
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
    beforeEach(async () => {
      // Mock code list values for testing
      const mockFolderTypes = [
        { value: 'menu', description: 'Menu' },
        { value: 'list', description: 'List' },
        { value: 'cartography', description: 'Cartography' }
      ];
      const mockLeafTypes = [
        { value: 'task', description: 'Task' },
        { value: 'map', description: 'Map' },
        { value: 'fav', description: 'Favorites' },
        { value: 'nm', description: 'Near me' },
        { value: 'cartography', description: 'Cartography' }
      ];
      
      // Initialize the code lists manually
      component['codelists'].set('treenode.folder.type', mockFolderTypes as any);
      component['codelists'].set('treenode.leaf.type', mockLeafTypes as any);
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

    it('should filter leaf types for cartography tree', () => {
      component.currentTreeType = 'cartography';
      const leafTypes = component.getAvailableLeafTypes();
      
      const values = leafTypes.map(t => t.value);
      expect(values).toContain('task');
      expect(values).toContain('cartography');
    });

    it('should correctly identify leaf nodes', () => {
      component.currentTreeType = 'touristic';
      
      expect(component.isNodeTypeALeaf('task')).toBe(true);
      expect(component.isNodeTypeALeaf('map')).toBe(true);
      expect(component.isNodeTypeALeaf('fav')).toBe(true);
      expect(component.isNodeTypeALeaf('nm')).toBe(true);
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
      
      expect(component.canNodeHaveChildren('task')).toBe(false);
      expect(component.canNodeHaveChildren('map')).toBe(false);
      expect(component.canNodeHaveChildren('fav')).toBe(false);
      expect(component.canNodeHaveChildren('nm')).toBe(false);
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
});

