import { FormControl, FormGroup } from '@angular/forms';

import { describe, expect, it } from '@jest/globals';

import { TaskProjection } from '@app/domain';

import { TaskQueryFormComponent } from './task-query-form.component';

describe('TaskQueryFormComponent (properties contract)', () => {
  it('preserves unknown properties keys on createObject while updating scope/command', () => {
    const component = Object.create(TaskQueryFormComponent.prototype) as TaskQueryFormComponent;
    component.entityToEdit = TaskProjection.fromObject({
      id: 10,
      name: 'query',
      properties: {
        scope: 'old-scope',
        command: 'old-command',
        custom: { stable: true }
      }
    });
    component.entityForm = new FormGroup({
      name: new FormControl('query'),
      scope: new FormControl('new-scope'),
      command: new FormControl('new-command'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(null)
    });

    const result = component.createObject(10);

    expect(result.properties?.scope).toBe('new-scope');
    expect(result.properties?.command).toBe('new-command');
    expect(result.properties?.custom).toEqual({ stable: true });
  });
});
