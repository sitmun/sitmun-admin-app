export type PositionsSurface = 'manage' | 'repair' | 'hidden';

export function positionsSurface(input: {
  username: string | null | undefined;
  leftoverCount: number;
  isNew: boolean;
}): PositionsSurface {
  const username = input.username ?? '';
  if (!input.isNew && username === 'public') {
    return 'hidden';
  }
  if (!input.isNew && username === 'admin') {
    return input.leftoverCount > 0 ? 'repair' : 'hidden';
  }
  return 'manage';
}

export function canShowPositionsTab(surface: PositionsSurface): boolean {
  return surface !== 'hidden';
}
