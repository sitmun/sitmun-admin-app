import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ResourceService } from '@app/core/hal/resource/resource.service';
import { LoggerService } from '@app/services/logger.service';

import { TreeNodeService } from './tree-node.service';
import { TreeNode } from '../models/tree-node.model';

describe('TreeNodeService', () => {
  let service: TreeNodeService;
  let resourceService: { update: jest.Mock };
  let loggerService: {
    warn: jest.Mock;
    error: jest.Mock;
    debug: jest.Mock;
  };

  beforeEach(() => {
    resourceService = {
      update: jest.fn()
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
});
