import { TestBed } from '@angular/core/testing';

import { of, throwError } from 'rxjs';

import { ResourceService } from '@app/core/hal/resource/resource.service';
import { ResourceHelper } from '@app/core/hal/resource/resource-helper';
import { LoggerService } from '@app/services/logger.service';

import { TreeNodeService } from './tree-node.service';
import { TreeNode } from '../models/tree-node.model';

describe('TreeNodeService', () => {
  let service: TreeNodeService;
  let resourceService: { update: jest.Mock; create: jest.Mock; delete: jest.Mock };
  let loggerService: {
    warn: jest.Mock;
    error: jest.Mock;
    debug: jest.Mock;
  };

  beforeEach(() => {
    resourceService = {
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    };
    loggerService = {
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TreeNodeService,
        { provide: ResourceService, useValue: resourceService },
        { provide: LoggerService, useValue: loggerService }
      ]
    });

    service = TestBed.inject(TreeNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.TREE_NODE_API).toBe('tree-nodes');
  });

  describe('update', () => {
    it('fetches relation links when moving to root', (done) => {
      const input = new TreeNode();
      input.id = 1;
      input.parent = null;

      const updated = new TreeNode();
      updated.id = 1;
      updated._links = { self: { href: '/tree-nodes/1' } } as any;

      const fetched = new TreeNode();
      fetched.id = 1;
      fetched._links = {
        self: { href: '/tree-nodes/1' },
        parent: { href: '/tree-nodes/1/parent' },
        tree: { href: '/tree-nodes/1/tree' },
        cartography: { href: '/tree-nodes/1/cartography' },
        task: { href: '/tree-nodes/1/task' }
      } as any;

      resourceService.update.mockReturnValue(of(updated));

      const getSpy = jest.spyOn(service, 'get').mockReturnValue(of(fetched));
      const relationSpy = jest
        .spyOn(service as any, 'applyRelationUpdate')
        .mockReturnValue(of(null));
      const parentSpy = jest
        .spyOn(service as any, 'applyParentUpdate')
        .mockReturnValue(of(null));

      service.update(input).subscribe({
        next: result => {
          expect(result).toBe(updated);
          expect(getSpy).toHaveBeenCalledWith(1);
          expect(parentSpy).toHaveBeenCalledWith(fetched, null);
          expect(relationSpy).toHaveBeenCalled();
          done();
        },
        error: done
      });
    });

    it('updates node with all relations', (done) => {
      const tree = { id: 10, _links: { self: { href: '/trees/10' } } };
      const cartography = { id: 20, _links: { self: { href: '/cartographies/20' } } };
      const task = { id: 30, _links: { self: { href: '/tasks/30' } } };
      const parent = { id: 40, _links: { self: { href: '/tree-nodes/40' } } };

      const input = new TreeNode();
      input.id = 1;
      input.tree = tree as any;
      input.cartography = cartography as any;
      input.task = task as any;
      input.parent = parent as any;

      const updated = new TreeNode();
      updated.id = 1;
      updated._links = {
        self: { href: '/tree-nodes/1' },
        tree: { href: '/tree-nodes/1/tree' },
        cartography: { href: '/tree-nodes/1/cartography' },
        task: { href: '/tree-nodes/1/task' },
        parent: { href: '/tree-nodes/1/parent' }
      } as any;

      resourceService.update.mockReturnValue(of(updated));
      const relationSpy = jest.spyOn(service as any, 'applyRelationUpdate').mockReturnValue(of(null));
      const parentSpy = jest.spyOn(service as any, 'applyParentUpdate').mockReturnValue(of(null));

      service.update(input).subscribe({
        next: result => {
          expect(result.id).toBe(1);
          expect(relationSpy).toHaveBeenCalledWith(updated, 'tree', tree, expect.any(Object));
          expect(relationSpy).toHaveBeenCalledWith(updated, 'cartography', cartography, expect.any(Object));
          expect(relationSpy).toHaveBeenCalledWith(updated, 'task', task, expect.any(Object));
          expect(parentSpy).toHaveBeenCalledWith(updated, parent);
          done();
        },
        error: done
      });
    });

    it('deletes task and cartography relations when set to null', (done) => {
      const tree = { id: 10, _links: { self: { href: '/trees/10' } } };
      
      const input = new TreeNode();
      input.id = 1;
      input.tree = tree as any;
      input.task = null;
      input.cartography = null;

      const updated = new TreeNode();
      updated.id = 1;
      updated._links = {
        self: { href: '/tree-nodes/1' },
        tree: { href: '/tree-nodes/1/tree' },
        cartography: { href: '/tree-nodes/1/cartography' },
        task: { href: '/tree-nodes/1/task' },
        parent: { href: '/tree-nodes/1/parent' }
      } as any;
      updated.updateRelationEx = jest.fn().mockReturnValue(of(null));
      updated.substituteRelation = jest.fn().mockReturnValue(of(null));

      resourceService.update.mockReturnValue(of(updated));
      jest.spyOn(service as any, 'applyParentUpdate').mockReturnValue(of(null));

      service.update(input).subscribe({
        next: () => {
          expect(updated.updateRelationEx).toHaveBeenCalledWith('task', null);
          expect(updated.updateRelationEx).toHaveBeenCalledWith('cartography', null);
          expect(updated.substituteRelation).toHaveBeenCalledWith('tree', tree);
          done();
        },
        error: done
      });
    });
  });

  describe('ensureRelationLinks', () => {
    it('returns target when all links present', (done) => {
      const target = new TreeNode();
      target.id = 1;
      target._links = {
        tree: { href: '/tree-nodes/1/tree' },
        cartography: { href: '/tree-nodes/1/cartography' },
        task: { href: '/tree-nodes/1/task' },
        parent: { href: '/tree-nodes/1/parent' }
      } as any;

      (service as any).ensureRelationLinks(target, ['tree', 'cartography', 'task', 'parent']).subscribe({
        next: (result: TreeNode) => {
          expect(result).toBe(target);
          done();
        }
      });
    });

    it('fetches node when links are missing', (done) => {
      const target = new TreeNode();
      target.id = 1;
      target._links = { self: { href: '/tree-nodes/1' } } as any;

      const fetched = new TreeNode();
      fetched.id = 1;
      fetched._links = {
        self: { href: '/tree-nodes/1' },
        tree: { href: '/tree-nodes/1/tree' }
      } as any;

      const getSpy = jest.spyOn(service, 'get').mockReturnValue(of(fetched));

      (service as any).ensureRelationLinks(target, ['tree']).subscribe({
        next: (result: TreeNode) => {
          expect(getSpy).toHaveBeenCalledWith(1);
          expect(result).toBe(fetched);
          done();
        }
      });
    });

    it('handles fetch error gracefully', (done) => {
      const target = new TreeNode();
      target.id = 1;
      target._links = {} as any;

      jest.spyOn(service, 'get').mockReturnValue(throwError(() => new Error('Not found')));

      (service as any).ensureRelationLinks(target, ['tree']).subscribe({
        next: (result: TreeNode) => {
          expect(result).toBe(target);
          expect(loggerService.warn).toHaveBeenCalled();
          done();
        }
      });
    });

    it('returns target when id is missing', (done) => {
      const target = new TreeNode();
      
      (service as any).ensureRelationLinks(target, ['tree']).subscribe({
        next: (result: TreeNode) => {
          expect(result).toBe(target);
          done();
        }
      });
    });
  });

  describe('applyRelationUpdate', () => {
    it('skips null tree relation', (done) => {
      const target = new TreeNode();
      target._links = { tree: { href: '/tree-nodes/1/tree' } } as any;

      (service as any).applyRelationUpdate(target, 'tree', null, {}).subscribe({
        next: (result: any) => {
          expect(result).toBeNull();
          done();
        }
      });
    });

    it('deletes null task relation', (done) => {
      const target = new TreeNode();
      target._links = { task: { href: '/tree-nodes/1/task' } } as any;
      target.updateRelationEx = jest.fn().mockReturnValue(of(null));

      (service as any).applyRelationUpdate(target, 'task', null, {}).subscribe({
        next: () => {
          expect(target.updateRelationEx).toHaveBeenCalledWith('task', null);
          done();
        }
      });
    });

    it('deletes null cartography relation', (done) => {
      const target = new TreeNode();
      target._links = { cartography: { href: '/tree-nodes/1/cartography' } } as any;
      target.updateRelationEx = jest.fn().mockReturnValue(of(null));

      (service as any).applyRelationUpdate(target, 'cartography', null, {}).subscribe({
        next: () => {
          expect(target.updateRelationEx).toHaveBeenCalledWith('cartography', null);
          done();
        }
      });
    });

    it('handles delete relation error', (done) => {
      const target = new TreeNode();
      target._links = { task: { href: '/tree-nodes/1/task' } } as any;
      target.updateRelationEx = jest.fn().mockReturnValue(throwError(() => new Error('Delete failed')));

      (service as any).applyRelationUpdate(target, 'task', null, {}).subscribe({
        next: (result: any) => {
          expect(result).toBeNull();
          expect(loggerService.error).toHaveBeenCalled();
          done();
        }
      });
    });

    it('substitutes relation when resource is valid', (done) => {
      const target = new TreeNode();
      target._links = { tree: { href: '/tree-nodes/1/tree' } } as any;
      target.substituteRelation = jest.fn().mockReturnValue(of(null));

      const resource = { id: 10, _links: { self: { href: '/trees/10' } } };
      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(true);

      (service as any).applyRelationUpdate(target, 'tree', resource, {}).subscribe({
        next: () => {
          expect(target.substituteRelation).toHaveBeenCalledWith('tree', resource);
          done();
        }
      });
    });

    it('skips substitution when resource has no self link', (done) => {
      const target = new TreeNode();
      target._links = { tree: { href: '/tree-nodes/1/tree' } } as any;

      const resource = { id: 10 };
      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(false);

      (service as any).applyRelationUpdate(target, 'tree', resource, { context: 'test' }).subscribe({
        next: (result: any) => {
          expect(result).toBeNull();
          expect(loggerService.warn).toHaveBeenCalled();
          done();
        }
      });
    });

    it('handles substitute relation error', (done) => {
      const target = new TreeNode();
      target._links = { tree: { href: '/tree-nodes/1/tree' } } as any;
      target.substituteRelation = jest.fn().mockReturnValue(throwError(() => new Error('Substitute failed')));

      const resource = { id: 10, _links: { self: { href: '/trees/10' } } };
      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(true);

      (service as any).applyRelationUpdate(target, 'tree', resource, {}).subscribe({
        next: (result: any) => {
          expect(result).toBeNull();
          expect(loggerService.error).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  describe('applyParentUpdate', () => {
    it('deletes parent when null', (done) => {
      const target = new TreeNode();
      target._links = { parent: { href: '/tree-nodes/1/parent' } } as any;
      target.updateRelationEx = jest.fn().mockReturnValue(of(null));

      (service as any).applyParentUpdate(target, null).subscribe({
        next: () => {
          expect(target.updateRelationEx).toHaveBeenCalledWith('parent', null);
          done();
        }
      });
    });

    it('handles delete parent error', (done) => {
      const target = new TreeNode();
      target._links = { parent: { href: '/tree-nodes/1/parent' } } as any;
      target.updateRelationEx = jest.fn().mockReturnValue(throwError(() => new Error('Delete failed')));

      (service as any).applyParentUpdate(target, null).subscribe({
        next: (result: any) => {
          expect(result).toBeNull();
          expect(loggerService.error).toHaveBeenCalled();
          done();
        }
      });
    });

    it('applies parent relation update when not null', (done) => {
      const target = new TreeNode();
      target._links = { parent: { href: '/tree-nodes/1/parent' } } as any;
      
      const parent = { id: 40, _links: { self: { href: '/tree-nodes/40' } } };
      const applySpy = jest.spyOn(service as any, 'applyRelationUpdate').mockReturnValue(of(null));

      (service as any).applyParentUpdate(target, parent).subscribe({
        next: () => {
          expect(applySpy).toHaveBeenCalledWith(target, 'parent', parent, expect.any(Object));
          done();
        }
      });
    });
  });

  describe('save', () => {
    it('calls update when node can be updated', (done) => {
      const node = new TreeNode();
      node.id = 1;
      node._links = { self: { href: '/tree-nodes/1' } } as any;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(true);
      const updateSpy = jest.spyOn(service, 'update').mockReturnValue(of(node));

      service.save(node).subscribe({
        next: (result) => {
          expect(updateSpy).toHaveBeenCalledWith(node);
          expect(result).toBe(node);
          done();
        }
      });
    });

    it('calls create when node cannot be updated', (done) => {
      const node = new TreeNode();
      node.id = -1;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(false);
      const createSpy = jest.spyOn(service, 'create').mockReturnValue(of(node));

      service.save(node).subscribe({
        next: (result) => {
          expect(createSpy).toHaveBeenCalledWith(node);
          expect(result).toBe(node);
          done();
        }
      });
    });

    it('ensures self link for persisted nodes without links', (done) => {
      const node = new TreeNode();
      node.id = 5;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(false);
      const createProxySpy = jest.spyOn(service, 'createProxy').mockReturnValue({
        _links: { self: { href: '/tree-nodes/5' } }
      } as any);
      jest.spyOn(service, 'create').mockReturnValue(of(node));

      service.save(node).subscribe({
        next: () => {
          expect(createProxySpy).toHaveBeenCalledWith(5);
          expect(node._links).toBeDefined();
          done();
        }
      });
    });
  });

  describe('deleteById', () => {
    it('deletes node by id', (done) => {
      const proxy = new TreeNode();
      proxy.id = 1;
      proxy._links = { self: { href: '/tree-nodes/1' } } as any;

      jest.spyOn(service, 'createProxy').mockReturnValue(proxy);
      const deleteSpy = jest.spyOn(service, 'delete').mockReturnValue(of(null));

      service.deleteById(1).subscribe({
        next: (result) => {
          expect(deleteSpy).toHaveBeenCalledWith(proxy);
          expect(result).toBeNull();
          done();
        }
      });
    });

    it('returns null when proxy cannot be created', (done) => {
      jest.spyOn(service, 'createProxy').mockReturnValue(null);

      service.deleteById(999).subscribe({
        next: (result) => {
          expect(result).toBeNull();
          done();
        }
      });
    });
  });

  describe('ensureSelfLink', () => {
    it('does nothing when node can be updated', () => {
      const node = new TreeNode();
      node.id = 1;
      node._links = { self: { href: '/tree-nodes/1' } } as any;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(true);

      (service as any).ensureSelfLink(node);

      // Should not modify the node
      expect(node._links.self.href).toBe('/tree-nodes/1');
    });

    it('does nothing when node id is null', () => {
      const node = new TreeNode();
      node.id = null;

      (service as any).ensureSelfLink(node);

      expect(node._links).toBeUndefined();
    });

    it('does nothing when node id is negative', () => {
      const node = new TreeNode();
      node.id = -1;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(false);

      (service as any).ensureSelfLink(node);

      expect(node._links).toBeUndefined();
    });

    it('adds self link from proxy when node has positive id', () => {
      const node = new TreeNode();
      node.id = 5;

      const proxy = new TreeNode();
      proxy._links = { self: { href: '/tree-nodes/5' } } as any;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(false);
      jest.spyOn(service, 'createProxy').mockReturnValue(proxy);

      (service as any).ensureSelfLink(node);

      expect(node._links).toBeDefined();
      expect(node._links.self.href).toBe('/tree-nodes/5');
    });

    it('does nothing when createProxy returns null', () => {
      const node = new TreeNode();
      node.id = 5;

      jest.spyOn(ResourceHelper, 'canBeUpdated').mockReturnValue(false);
      jest.spyOn(service, 'createProxy').mockReturnValue(null);

      (service as any).ensureSelfLink(node);

      expect(node._links).toBeUndefined();
    });
  });
});
