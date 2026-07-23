import { TestBed } from '@angular/core/testing';

import { TreeRulesService } from './tree-rules.service';
import { CodeList } from '../../codelist/models/codelist.model';


describe('TreeRulesService', () => {
  let service: TreeRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeRulesService);
  });

  it('returns allowed root types for cartography trees', () => {
    expect(service.getAllowedRootTypes('cartography')).toEqual(['folder']);
  });

  it('detects container node types', () => {
    expect(service.canNodeTypeHaveChildren('cartography', 'folder')).toBe(true);
    expect(service.canNodeTypeHaveChildren('cartography', 'cartography')).toBe(false);
  });

  it('lists node types for a tree type', () => {
    expect(service.getNodeTypesForTree('cartography')).toEqual(['folder', 'cartography']);
  });

  it('returns allowed children for a parent node type', () => {
    expect(service.getAllowedChildrenForNodeType('cartography', 'folder'))
      .toEqual(['cartography', 'folder']);
  });

  it('reads panel visibility from config', () => {
    expect(service.getNodePanelConfig('cartography', 'cartography', 'showCartographyPanel')).toBe(true);
    expect(service.getNodePanelConfig('cartography', 'folder', 'showCartographyPanel')).toBe(false);
  });

  it('picks the first allowed codelist value from candidates', () => {
    const available: CodeList[] = [
      { value: 'list', description: 'List' } as CodeList,
      { value: 'task', description: 'Task' } as CodeList,
    ];
    expect(service.pickFirstAllowedFromCodeList(['missing', 'task'], available)).toBe('task');
  });

  it('resolves default container and leaf types', () => {
    const available: CodeList[] = [
      { value: 'folder', description: 'Folder' } as CodeList,
      { value: 'cartography', description: 'Cartography' } as CodeList,
    ];
    expect(service.getDefaultContainerTypeFromRules('cartography', available)).toBe('folder');
    expect(service.getDefaultLeafTypeFromRules('cartography', available)).toBe('cartography');
  });

  it('resolves node type icons and fonts', () => {
    expect(service.getNodeTypeIcon('cartography', 'cartography')).toBe('stacks');
    expect(service.getNodeTypeIconFont('cartography', 'cartography')).toBe('material-symbols-outlined');
    expect(service.getNodeTypeIcon('cartography', 'missing')).toBe('description');
  });
});
