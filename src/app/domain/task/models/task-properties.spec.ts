import { TaskPropertiesContract } from './task-properties';

describe('TaskPropertiesContract', () => {
  it('normalizes non-object values to empty object', () => {
    expect(TaskPropertiesContract.fromRaw(null)).toEqual({});
    expect(TaskPropertiesContract.fromRaw(undefined)).toEqual({});
    expect(TaskPropertiesContract.fromRaw('invalid')).toEqual({});
    expect(TaskPropertiesContract.fromRaw([])).toEqual({});
  });

  it('returns safe defaults for known getters', () => {
    const properties = { unknown: true };
    expect(TaskPropertiesContract.getScope(properties)).toBeNull();
    expect(TaskPropertiesContract.getCommand(properties)).toBeNull();
    expect(TaskPropertiesContract.getParameters(properties)).toEqual([]);
    expect(TaskPropertiesContract.getFields(properties)).toEqual([]);
  });

  it('preserves unknown keys when updating known keys', () => {
    const properties = {
      scope: 'SQL_QUERY',
      custom: { enabled: true }
    };
    const updated = TaskPropertiesContract.withCommand(properties, 'select 1');

    expect(updated.custom).toEqual({ enabled: true });
    expect(updated.scope).toBe('SQL_QUERY');
    expect(updated.command).toBe('select 1');
  });

  it('clones array values when setting parameters and fields', () => {
    const parameters = [{ name: 'id' }];
    const fields = [{ name: 'title' }];

    const withParameters = TaskPropertiesContract.withParameters({}, parameters);
    const withFields = TaskPropertiesContract.withFields(withParameters, fields);

    parameters.push({ name: 'extra' });
    fields.push({ name: 'another' });

    expect(TaskPropertiesContract.getParameters(withFields)).toEqual([{ name: 'id' }]);
    expect(TaskPropertiesContract.getFields(withFields)).toEqual([{ name: 'title' }]);
  });
});
