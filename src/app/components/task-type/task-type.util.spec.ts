import { formatTaskTypeIdentifier } from './task-type.util';

describe('formatTaskTypeIdentifier', () => {
  it('returns id only when name is missing', () => {
    expect(formatTaskTypeIdentifier(0)).toBe('0');
    expect(formatTaskTypeIdentifier(0, null)).toBe('0');
  });

  it('returns id and name when name is present', () => {
    expect(formatTaskTypeIdentifier(5, 'consulta')).toBe('5 (consulta)');
  });
});
