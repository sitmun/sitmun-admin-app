import { TreesFormComponent } from '../trees-form.component';

/** Partial stub for manually assigned TreesFormComponent.treeNodesComponent. */
export type TreeNodesComponentStub = {
  hasUnsavedChanges: jest.Mock<boolean>;
  hasUnsavedChangesForToolbar: jest.Mock<boolean>;
  treeNodeForm: null;
  getNodesForValidation?: jest.Mock<unknown[]>;
  dataTree?: ReturnType<typeof createMockDataTree>;
  saveNodes?: jest.Mock;
};

export function createTreeNodesStub(
  overrides: Partial<Omit<TreeNodesComponentStub, 'treeNodeForm'>> & {
    treeNodeForm?: null;
    getNodesForValidation?: jest.Mock<unknown[]>;
  } = {}
): TreeNodesComponentStub {
  return {
    hasUnsavedChanges: jest.fn(() => false),
    hasUnsavedChangesForToolbar: jest.fn(() => false),
    treeNodeForm: null,
    ...overrides,
  };
}

export function assignTreeNodesStub(
  component: TreesFormComponent,
  overrides: Parameters<typeof createTreeNodesStub>[0] = {}
): TreeNodesComponentStub {
  const stub = createTreeNodesStub(overrides);
  component.treeNodesComponent = stub as any;
  return stub;
}

export function createTouristicRootNode(
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    isRoot: true,
    name: '',
    id: null,
    children: [],
    ...overrides,
  };
}

export function createTouristicRootWithMenu(
  menuOverrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return createTouristicRootNode({
    children: [
      {
        name: 'Menu',
        nodeType: 'menu',
        children: [],
        status: 'pendingCreation',
        parent: null,
        ...menuOverrides,
      },
    ],
  });
}

export function createMockDataTree(rootChildren: unknown[] = []): {
  dataSource: { data: Record<string, unknown>[] };
  refreshTree: jest.Mock<Promise<void>>;
} {
  const root = createTouristicRootNode({ children: rootChildren });
  return {
    dataSource: { data: [root] },
    refreshTree: jest.fn(() => Promise.resolve()),
  };
}
