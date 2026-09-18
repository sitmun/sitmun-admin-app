import { canShowPositionsTab, positionsSurface } from './positions-surface';

describe('positionsSurface', () => {
  it('manages ordinary and new users, including unsaved admin/public names', () => {
    expect(positionsSurface({ username: 'alice', leftoverCount: 0, isNew: false })).toBe('manage');
    expect(positionsSurface({ username: 'alice', leftoverCount: 3, isNew: false })).toBe('manage');
    expect(positionsSurface({ username: '', leftoverCount: 0, isNew: true })).toBe('manage');
    expect(positionsSurface({ username: 'admin', leftoverCount: 0, isNew: true })).toBe('manage');
    expect(positionsSurface({ username: 'public', leftoverCount: 2, isNew: true })).toBe('manage');
  });

  it('hides public and empty admin; repairs leftover admin only', () => {
    expect(positionsSurface({ username: 'public', leftoverCount: 0, isNew: false })).toBe('hidden');
    expect(positionsSurface({ username: 'public', leftoverCount: 4, isNew: false })).toBe('hidden');
    expect(positionsSurface({ username: 'admin', leftoverCount: 0, isNew: false })).toBe('hidden');
    expect(positionsSurface({ username: 'admin', leftoverCount: 2, isNew: false })).toBe('repair');
  });

  it('shows the tab for manage and repair only', () => {
    expect(canShowPositionsTab('manage')).toBe(true);
    expect(canShowPositionsTab('repair')).toBe(true);
    expect(canShowPositionsTab('hidden')).toBe(false);
  });
});
