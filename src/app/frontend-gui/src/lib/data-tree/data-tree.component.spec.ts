import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { FileDatabase , DataTreeComponent } from './data-tree.component';


describe('DataTreeComponent', () => {
  let component: DataTreeComponent;
  let fixture: ComponentFixture<DataTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTreeComponent ],
      imports: [
        TranslateModule.forRoot(),
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        BrowserAnimationsModule
      ],
      providers: [
        FileDatabase,
        TranslateService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTreeComponent);
    component = fixture.componentInstance;

    component.getAll = () => of([]);
    component.allNewElements = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showMappingInTaskPanelForNodeType', () => {
    it('returns true for touristic + task', () => {
      component.currentTreeType = 'touristic';
      expect(component.showMappingInTaskPanelForNodeType('task')).toBe(true);
    });

    it('returns false for touristic + menu', () => {
      component.currentTreeType = 'touristic';
      expect(component.showMappingInTaskPanelForNodeType('menu')).toBe(false);
    });

    it('returns false for cartography + cartography', () => {
      component.currentTreeType = 'cartography';
      expect(component.showMappingInTaskPanelForNodeType('cartography')).toBe(false);
    });

    it('returns false when currentTreeType is not set', () => {
      component.currentTreeType = undefined as any;
      expect(component.showMappingInTaskPanelForNodeType('task')).toBe(false);
    });
  });

  describe('getViewModeIcon', () => {
    it('returns mapped icon for known view mode codes', () => {
      expect(component.getViewModeIcon('dl')).toBe('view_list');
      expect(component.getViewModeIcon('rt')).toBe('route');
      expect(component.getViewModeIcon('ne')).toBe('near_me');
      expect(component.getViewModeIcon('sch')).toBe('schedule');
      expect(component.getViewModeIcon('evt')).toBe('event');
      expect(component.getViewModeIcon('evtcat')).toBe('event');
      expect(component.getViewModeIcon('evtloc')).toBe('event');
      expect(component.getViewModeIcon('ms')).toBe('map');
      expect(component.getViewModeIcon('gallery')).toBe('photo_library');
    });

    it('returns fallback for unknown or empty viewMode', () => {
      expect(component.getViewModeIcon('unknown')).toBe('list');
      expect(component.getViewModeIcon('')).toBe('list');
    });
  });

  describe('getNodeIcon (main icon)', () => {
    it('returns nodeType icon for touristic task even when unconfigured (folder is secondary hint)', () => {
      component.currentTreeType = 'touristic';
      const node: any = { status: null, nodeType: 'task', taskId: null, viewMode: null, type: 'node' };
      expect(component.getNodeIcon(node)).toBe('sync');
    });

    it('returns configured nodeType icon when taskId is present', () => {
      component.currentTreeType = 'touristic';
      const node: any = { status: null, nodeType: 'task', taskId: 123, viewMode: null, type: 'node' };
      expect(component.getNodeIcon(node)).toBe('sync');
    });

    it('returns configured nodeType icon when viewMode is present', () => {
      component.currentTreeType = 'touristic';
      const node: any = { status: null, nodeType: 'task', taskId: null, viewMode: 'dl', type: 'node' };
      expect(component.getNodeIcon(node)).toBe('sync');
    });
  });

  describe('showFolderHintForTaskGroupContainer', () => {
    it('returns true for touristic task with no taskId and no viewMode when config enables hint', () => {
      component.currentTreeType = 'touristic';
      const node: any = { nodeType: 'task', taskId: null, viewMode: null };
      expect(component.showFolderHintForTaskGroupContainer(node)).toBe(true);
    });

    it('returns false when taskId is set', () => {
      component.currentTreeType = 'touristic';
      const node: any = { nodeType: 'task', taskId: 123, viewMode: null };
      expect(component.showFolderHintForTaskGroupContainer(node)).toBe(false);
    });

    it('returns false when viewMode is set', () => {
      component.currentTreeType = 'touristic';
      const node: any = { nodeType: 'task', taskId: null, viewMode: 'dl' };
      expect(component.showFolderHintForTaskGroupContainer(node)).toBe(false);
    });

    it('returns false when currentTreeType has no folderHintForTaskGroupContainer for nodeType', () => {
      component.currentTreeType = 'cartography';
      const node: any = { nodeType: 'task', taskId: null, viewMode: null };
      expect(component.showFolderHintForTaskGroupContainer(node)).toBe(false);
    });
  });
});
