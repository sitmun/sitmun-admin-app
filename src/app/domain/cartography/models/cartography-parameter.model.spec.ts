import { CartographyParameter, persistedCartographyParameter, withEditableFormatOptions } from './cartography-parameter.model';

describe('cartography parameter format options', () => {
  it('copies stored options onto the grid fields', () => {
    const row = new CartographyParameter();
    row.options = {fractionDigits: 0, padFractionDigits: false, dateStyle: null, width: 12};

    withEditableFormatOptions(row);

    expect(row.fractionDigits).toBe(0);
    expect(row.padFractionDigits).toBe(false);
    expect(row.dateStyle).toBeNull();
  });

  it('persists grid edits as options and keeps unknown keys', () => {
    const row = new CartographyParameter();
    row.name = 'etrsxmax';
    row.options = {width: 12};
    row.fractionDigits = 2;
    row.padFractionDigits = true;
    row.dateStyle = null;

    const saved = persistedCartographyParameter(row);

    expect(saved.options).toEqual({width: 12, fractionDigits: 2, padFractionDigits: true});
    expect(saved.fractionDigits).toBeUndefined();
    expect(row.fractionDigits).toBe(2);
  });

  it('stores null when the grid has no options', () => {
    const row = new CartographyParameter();
    row.fractionDigits = null;
    row.padFractionDigits = false;
    row.dateStyle = null;

    expect(persistedCartographyParameter(row).options).toBeNull();
  });
});
