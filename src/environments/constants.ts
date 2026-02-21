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
  taskViewMode: {
    detailedList: 'dl',
    routes: 'rt',
    nearElements: 'ne',
    schedule: 'sch',
    events: 'evt',
    eventsCategories: 'evtcat',
    eventsLocations: 'evtloc',
    mapSearch: 'ms',
    gallery: 'gallery'
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
  extraImg: [],
  nodeMapping: {
    nodeOutputControls: [{
      key: 'id',
      label: 'nodeMapping.id',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.schedule,
        codeValue.taskViewMode.events,
        codeValue.taskViewMode.mapSearch,
        codeValue.taskViewMode.gallery
      ]
    },
    {
      key: 'name',
      label: 'nodeMapping.name',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.schedule,
        codeValue.taskViewMode.events,
        codeValue.taskViewMode.eventsCategories,
        codeValue.taskViewMode.eventsLocations,
        codeValue.taskViewMode.mapSearch
      ]
    },
    {
      key: 'distance',
      label: 'nodeMapping.distance',
      views: [
        codeValue.taskViewMode.nearElements
      ]
    },
    {
      key: 'description',
      label: 'nodeMapping.description',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'category',
      label: 'nodeMapping.category',
      views: [
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'image',
      label: 'nodeMapping.image',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.events,
        codeValue.taskViewMode.gallery
      ]
    },
    {
      key: 'leftbtnLabel',
      label: 'nodeMapping.leftbtnLabel',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
      ]
    },
    {
      key: 'leftbtn',
      label: 'nodeMapping.leftbtn',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
      ]
    },
    {
      key: 'rightbtnLabel',
      label: 'nodeMapping.rightbtnLabel',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'rightbtn',
      label: 'nodeMapping.rightbtn',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'hour',
      label: 'nodeMapping.hour',
      views: [
        codeValue.taskViewMode.schedule
      ]
    },
    {
      key: 'startdate',
      label: 'nodeMapping.startdate',
      views: [
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'enddate',
      label: 'nodeMapping.enddate',
      views: [
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'address',
      label: 'nodeMapping.address',
      views: [
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'muni',
      label: 'nodeMapping.town',
      views: [
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'length',
      label: 'nodeMapping.length',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'difficulty',
      label: 'nodeMapping.difficulty',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'time',
      label: 'nodeMapping.time',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'start',
      label: 'nodeMapping.start',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'end',
      label: 'nodeMapping.end',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'circ',
      label: 'nodeMapping.circ',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'graphic',
      label: 'nodeMapping.graphic',
      views: [
        codeValue.taskViewMode.routes
      ]
    },
    {
      key: 'path',
      label: 'nodeMapping.path',
      views: [
        codeValue.taskViewMode.schedule
      ]
    },
    {
      key: 'geom',
      label: 'nodeMapping.geometry',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.events,
        codeValue.taskViewMode.mapSearch
      ]
    },
    {
      key: 'proj',
      label: 'nodeMapping.proj',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.routes,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.events,
        codeValue.taskViewMode.mapSearch
      ]
    }],
    appOptions: [{
      label: 'X',
      value: '${LONGITUD}'
    }, {
      label: 'Y',
      value: '${LATITUD}'
    }, {
      label: 'Fecha desde',
      value: '${STARTDATE}'
    }, {
      label: 'Fecha hasta',
      value: '${ENDDATE}'
    }, {
      label: 'Distancia',
      value: '${DISTANCE}'
    }, {
      label: 'Busqueda general',
      value: '${KEYWORD}'
    }, {
      label: 'Filtro WFS',
      value: '${WFSFILTER}'
    }, {
      label: 'Filtro WFS unitario',
      value: '${WFSUNITARYFILTER}'
    }, {
      label: 'Idioma',
      value: '${LANGUAGE}'
    }],
    btnlabelOptions: [{
      label: 'Extra info',
      value: 'Extra info'
    },{
      label: 'nodeMapping.price',
      value: 'btnLabel.price'
    }, {
      label: 'nodeMapping.schedule',
      value: 'btnLabel.schedule'
    }, {
      label: 'nodeMapping.call',
      value: 'btnLabel.call'
    }, {
      label: 'nodeMapping.point',
      value: 'btnLabel.point'
    }, {
      label: 'nodeMapping.link',
      value: 'btnLabel.link'
    }]
  }
};

export const magic = {
  taskEditTypeId: 0,
  taskBasicTypeId: 1,
  taskQueryTypeId: 5
}
