import {
  includedOwner,
  mappingAddTestId,
  mappingOptionTestId,
  mappingRowIds,
  mappingSelectTestId,
  templateOwner
} from './mia-mapping-testid';

describe('mia-mapping-testid', () => {
  const included = includedOwner(38);

  it('stamps included select, option, and add ids', () => {
    expect(mappingSelectTestId({owner: included, rowIndex: 0, side: 'mia'})).toBe(
      'mia-mapping-select--included--38--0--mia'
    );
    expect(mappingOptionTestId({owner: included, rowIndex: 0, side: 'mia', label: 'codigo'})).toBe(
      'mia-mapping-option--included--38--0--mia--codigo'
    );
    expect(mappingAddTestId(included)).toBe('mia-mapping-add--included--38');
  });

  it('percent-encodes hyphens so -- stays the delimiter', () => {
    expect(
      mappingOptionTestId({owner: included, rowIndex: 0, side: 'mia', label: 'e2e-map-a'})
    ).toBe('mia-mapping-option--included--38--0--mia--e2e%2Dmap%2Da');
  });

  it('encodes template owners as separate segments', () => {
    const owner = templateOwner({
      rootTemplateTaskId: 15,
      childTaskId: 38,
      referenceAlias: 'ref:a',
      depth: 1
    });
    expect(mappingSelectTestId({owner, rowIndex: 0, side: 'child'})).toBe(
      'mia-mapping-select--template--15--38--ref%3Aa--1--0--child'
    );
  });

  it('stamps row ids for template binding', () => {
    const ids = mappingRowIds(included, 0);
    expect(ids.miaSelect).toBe('mia-mapping-select--included--38--0--mia');
    expect(ids.childSelect).toBe('mia-mapping-select--included--38--0--child');
    expect(ids.option('child', 'codigo')).toBe(
      'mia-mapping-option--included--38--0--child--codigo'
    );
  });

  it('rejects an empty option label', () => {
    expect(() =>
      mappingOptionTestId({owner: included, rowIndex: 0, side: 'mia', label: ''})
    ).toThrow('non-empty label');
  });
});
