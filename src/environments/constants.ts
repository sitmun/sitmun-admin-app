const codeValue = {
  applicationType: {
    touristicApp: 'T',
    externalApp: 'E',
    internalApp: 'I'
  },
  queryTaskScope: {
    sqlQuery: 'sql-query',
    webApiQuery: 'web-api-query',
    cartographyQuery: 'cartography-query'
  },
  editionTaskScope: {
    dbEdition: 'db-edit',
    cartographyEdition: 'feat-edit'
  },
  treeType: {
    touristicTree: 'touristic',
    cartography: 'cartography',
    edition: 'edition'
  },
  cartographyPermissionType: {
    cartographyGroup: 'C',
    report: 'I',
    backgroundMap: 'F',
    locationMap: 'M'
  },
  systemUser: {
    public: 'public',
  },
  serviceType: {
    wms: 'WMS'
  }
};

/**
 * Entity status constants used across data-grid, data-tree, and form components.
 * Centralizes status string literals to prevent typos and improve maintainability.
 */
const entityStatus = {
  /** Entity exists in database with no pending changes */
  statusOK: 'statusOK',
  /** Entity has been modified but not yet saved */
  pendingModify: 'pendingModify',
  /** Entity is marked for deletion but not yet saved */
  pendingDelete: 'pendingDelete',
  /** Entity is newly created but not yet saved */
  pendingCreation: 'pendingCreation',
  /** Entity is pending registration (layer-specific) */
  pendingRegistration: 'pendingRegistration',
  /** Entity is not available */
  notAvailable: 'notAvailable',
  /** Layer is not registered */
  unregisteredLayer: 'unregisteredLayer',
  /** Tree node has been modified (tree-specific status) */
  modified: 'Modified'
};

export const constants = {
  codeValue,
  entityStatus,
  treeRenderType: {
    folder: 'folder',
    node: 'node'
  },
  treeDomainKey: {
    cartography: 'cartography',
    task: 'task'
  },
  extraImg: []
};

export const magic = {
  taskEditTypeId: 0,
  taskBasicTypeId: 1,
  taskQueryTypeId: 5,
  taskMoreInfoTypeId: 6,
  taskMoreInfoAdvancedTypeId: 15
}
