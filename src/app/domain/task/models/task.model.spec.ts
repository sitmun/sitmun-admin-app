import { describe, expect, it } from '@jest/globals';

import { Task, TaskProjection } from './task.model';

describe('Task model properties contract', () => {
  it('normalizes invalid properties to empty object in Task.fromObject', () => {
    const task = Task.fromObject({ id: 1, properties: null });
    expect(task.properties).toEqual({});
  });

  it('preserves unknown keys in Task.fromObject', () => {
    const sourceProperties = {
      scope: 'SQL_QUERY',
      command: 'select * from test',
      custom: { enabled: true }
    };
    const task = Task.fromObject({ id: 1, properties: sourceProperties });

    expect(task.properties?.scope).toBe('SQL_QUERY');
    expect(task.properties?.command).toBe('select * from test');
    expect(task.properties?.custom).toEqual({ enabled: true });
  });

  it('normalizes invalid properties to empty object in TaskProjection.fromObject', () => {
    const projection = TaskProjection.fromObject({ id: 1, properties: undefined });
    expect(projection.properties).toEqual({});
  });

  it('preserves unknown keys in TaskProjection.fromObject', () => {
    const sourceProperties = {
      parameters: [{ name: 'a', type: 'string', value: 'b' }],
      anotherCustomFlag: true
    };
    const projection = TaskProjection.fromObject({ id: 2, properties: sourceProperties });

    expect(projection.properties?.parameters).toEqual([{ name: 'a', type: 'string', value: 'b' }]);
    expect(projection.properties?.anotherCustomFlag).toBe(true);
  });
});
