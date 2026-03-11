import * as PublicApi from './public_api';

describe('sitmun-frontend-gui public api', () => {
  it('exports the expected data-tree symbols', () => {
    expect(PublicApi.DataTreeComponent).toBeDefined();
    expect(PublicApi.FileNode).toBeDefined();
    expect(PublicApi.FileDatabase).toBeDefined();
    expect(PublicApi.buildFileTreeForTesting).toBeDefined();
  });

  it('does not export FileFlatNode', () => {
    expect((PublicApi as any).FileFlatNode).toBeUndefined();
  });
});
