import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from '@jest/globals';

import { TaskProjection } from '@app/domain';

import { TaskEditFormComponent } from './task-edit-form.component';

describe('TaskEditFormComponent (properties contract)', () => {
  it('preserves unknown properties keys on createObject while updating scope', () => {
    const component = Object.create(TaskEditFormComponent.prototype) as TaskEditFormComponent;
    component.entityToEdit = TaskProjection.fromObject({
      id: 20,
      name: 'edit',
      properties: {
        scope: 'old-scope',
        fields: [{ name: 'title' }],
        customFlag: 'keep-me'
      }
    });
    component.entityForm = new FormGroup({
      name: new FormControl('edit'),
      scope: new FormControl('new-scope'),
      connectionId: new FormControl(null),
      cartographyId: new FormControl(null),
      taskGroupId: new FormControl(null)
    });

    const result = component.createObject(20);

    expect(result.properties?.scope).toBe('new-scope');
    expect(result.properties?.fields).toEqual([{ name: 'title' }]);
    expect(result.properties?.customFlag).toBe('keep-me');
  });
});
