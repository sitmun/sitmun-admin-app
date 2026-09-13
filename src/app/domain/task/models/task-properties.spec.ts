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
    expect(TaskPropertiesContract.getTemplateHtml(properties)).toBeNull();
    expect(TaskPropertiesContract.getTemplateEditorState(properties)).toBeNull();
    expect(TaskPropertiesContract.hasDeprecatedPdfRegionHeights(properties)).toBe(false);
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

  it('reads and writes template html preserving unknown keys', () => {
    const updated = TaskPropertiesContract.withTemplateHtml({ scope: 'sql-query', custom: true }, '<h1>{{task_12.name}}</h1>');

    expect(TaskPropertiesContract.getTemplateHtml(updated)).toBe('<h1>{{task_12.name}}</h1>');
    expect(TaskPropertiesContract.getScope(updated)).toBe('sql-query');
    expect(updated.custom).toBe(true);
  });

  it('stores template editor state preserving existing values', () => {
    const editorState = { ops: [{ insert: 'hello' }] };
    const updated = TaskPropertiesContract.withTemplateEditorState({ command: 'select 1' }, editorState);

    expect(TaskPropertiesContract.getTemplateEditorState(updated)).toEqual(editorState);
    expect(TaskPropertiesContract.getCommand(updated)).toBe('select 1');
  });

  it('removes deprecated PDF region heights preserving unknown keys', () => {
    const updated = TaskPropertiesContract.withoutDeprecatedPdfRegionHeights({
      custom: true,
      pdfHeaderHeightMm: 25,
      pdfFooterHeightMm: '15',
    });

    expect(TaskPropertiesContract.hasDeprecatedPdfRegionHeights(updated)).toBe(false);
    expect(updated.custom).toBe(true);
  });

  it('reads and writes map image properties preserving unknown keys', () => {
    let updated = TaskPropertiesContract.withFormat({ custom: true }, 'png');
    updated = TaskPropertiesContract.withWidth(updated, 1024);
    updated = TaskPropertiesContract.withHeight(updated, 768);
    updated = TaskPropertiesContract.withSrs(updated, 'EPSG:4326');
    updated = TaskPropertiesContract.withBboxMarginPercent(updated, 15);
    updated = TaskPropertiesContract.withMapSources(updated, [{ serviceId: 9, layerNames: ['layer_a', 'layer_b'] }]);

    expect(TaskPropertiesContract.getFormat(updated)).toBe('png');
    expect(TaskPropertiesContract.getWidth(updated)).toBe(1024);
    expect(TaskPropertiesContract.getHeight(updated)).toBe(768);
    expect(TaskPropertiesContract.getSrs(updated)).toBe('EPSG:4326');
    expect(TaskPropertiesContract.getBboxMarginPercent(updated)).toBe(15);
    expect(TaskPropertiesContract.getMapSources(updated)).toEqual([{ serviceId: 9, layerNames: ['layer_a', 'layer_b'] }]);
    expect(updated.custom).toBe(true);
  });
});
