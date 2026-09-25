import { of } from 'rxjs';

import { Role, TaskAvailability, TaskAvailabilityProjection } from '@app/domain';
import { Status } from '@app/frontend-gui/src/lib/data-grid/data-grid.component';
import { constants } from '@environments/constants';

import { createTaskAvailabilitiesTable, createTaskRolesTable, TaskRelationTableContext } from './task-relation-tables';

describe('task relation tables', () => {
  function contextFor(state: { entity: { substituteAllRelation: jest.Mock } | null; entityId: number }) {
    const column = () => ({});
    const taskProxy = { id: state.entityId };
    const territoryProxy = { id: 7 };
    const taskService = {
      createProxy: jest.fn(() => taskProxy),
    };
    const territoryService = {
      createProxy: jest.fn(() => territoryProxy),
    };
    const taskAvailabilityService = {
      delete: jest.fn(() => of(null)),
      create: jest.fn(() => of(null)),
      createProxy: jest.fn(),
    };
    const context = {
      dialog: {},
      errorHandler: { handleError: jest.fn() },
      loadingService: {},
      utils: {
        getSelCheckboxColumnDef: column,
        getRouterLinkColumnDef: column,
        getNonEditableColumnDef: column,
        getNonEditableDateColumnDef: column,
        getStatusColumnDef: column,
      },
      roleService: {},
      territoryService,
      taskAvailabilityService,
      taskService,
      isNew: () => false,
      entity: () => state.entity,
      entityId: () => state.entityId,
    } as unknown as TaskRelationTableContext;

    return { context, taskService, territoryService, taskAvailabilityService };
  }

  it('saves roles on the entity assigned after the table is built', async () => {
    const state: { entity: { substituteAllRelation: jest.Mock } | null; entityId: number } = {
      entity: null,
      entityId: -1,
    };
    const { context } = contextFor(state);
    const roles = createTaskRolesTable(context);
    const saved = { substituteAllRelation: jest.fn(() => of(null)) };
    state.entity = saved;
    state.entityId = 99;

    await roles.handleSaveRelations({
      event: 'save',
      data: [{ id: 1, status: constants.entityStatus.pendingModify, newItem: false } as unknown as Role & Status],
    });

    expect(saved.substituteAllRelation).toHaveBeenCalledWith('roles', expect.any(Array));
  });

  it('creates a territory link with the task id assigned after the table is built', async () => {
    const state: { entity: { substituteAllRelation: jest.Mock } | null; entityId: number } = {
      entity: null,
      entityId: -1,
    };
    const { context, taskService, territoryService, taskAvailabilityService } = contextFor(state);
    const availabilities = createTaskAvailabilitiesTable(context);
    const saved = { substituteAllRelation: jest.fn(() => of(null)) };
    state.entity = saved;
    state.entityId = 99;
    const created = jest.spyOn(TaskAvailability, 'of').mockReturnValue({} as TaskAvailability);

    await availabilities.handleSaveRelations({
      event: 'save',
      data: [{
        id: 0,
        territoryId: 7,
        status: constants.entityStatus.pendingCreation,
        newItem: true,
      } as TaskAvailabilityProjection & Status],
    });

    expect(taskService.createProxy).toHaveBeenCalledWith(99);
    expect(territoryService.createProxy).toHaveBeenCalledWith(7);
    expect(created).toHaveBeenCalled();
    expect(taskAvailabilityService.create).toHaveBeenCalled();
    created.mockRestore();
  });
});
