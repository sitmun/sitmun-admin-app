export const config = {
  agGridTheme: "ag-theme-balham",
  scopeTypes: ['selectType', 'Municipal', 'Supramunicipal', 'Total'],
  tasksTypes: {
    'basic': 1,
    'download': 2,
    'document': 3,
    'locator': 4,
    'query': 5,
    'moreInfo': 6,
    'report': 7,
    'editionWFS': 8,
    'thematic': 9,
    'extraction': 10,
    'NUMEdition': 11,
    'RELEdition': 12,
    'VISEdition': 13,
    'HIDDENEdition': 14
  },
  tasksTypesNames:{
    'basic': "Basic",
    'download': "Download",
    'document': "Document",
    'locator': "Locator",
    'query': "Query",
    'moreInfo': "More info",
    'report': "Report",
    'editionWFS': "Cartography table (WFS)",
    'thematic': "Thematic",
    'extraction': "Extraction (FME)",
    'NUMEdition': "Data table",
    'RELEdition': "Relation table",
    'VISEdition': "Location view",
    'HIDDENEdition': "edicionHIDDEN"
  },
  taskSelectorFieldsForm:{
    "groupId": "group",
    "uiId": "ui",
    "serviceId": "service"
  },
  tasksSelectorsIdentifiers:{
    taskGroup: "taskGroup",
    taskUI: "taskUi",
    wfsServices: "wfsServices",
    fmeServices: "fmeServices",
    locators: "this.locators",
    cartographies: "cartographies",
    connection: "connection",

  },
  taskTablesSortField:{
    'availabilities': 'territoryName',
    'roles':'name',
    'parameters': 'order'
  },
  taskTablesDialogsSortField:{
    'availabilities': 'name',
    'roles':'name',
  },
  taskSelectorSortField:{
    'taskGroup': 'name',
    'service': 'name'
  },
  defaultLang: "ca",
  _embedded: {
    applications: 'applications',
    applicationParameters: 'application-parameters',
    applicationBackgrounds: 'application-backgrounds',
    connection: 'connections',
    cartographies: 'cartographies',
    cartographuParameter: 'cartography-parameters',
    cartographyFilters:'cartography-filters',
    cartographyPermission: 'cartography-groups',
    roles: 'roles',
    services: 'services',
    taskGroups: '',
    tasks: 'tasks',
    taskParameters: 'task-parameters',
    taskAvailabilities: 'task-availabilites',
    territories: 'territories',
    trees: 'trees',
    users: 'users',
    userPosition:'user-positions'
  },
  languagesObjects: {
  },
  languagesToUse: null,
  translationColumns: {
    cartographyDescription : 'GEO_ABSTRACT',
    territoryName : 'TER_NAME',
    serviceDescription: 'SER_ABSTRACT',
    applicationName: 'APP_NAME',
    applicationDescription: 'APP_DESCRIPTION',
    applicationTitle: 'APP_TITLE',
    backgroundName: 'BAC_NAME',
    backgroundDescription: 'BAC_DESC',
    treeName: 'TRE_NAME',
    treeDescription: 'TRE_ABSTRACT',
    treeNodeName: 'TNO_NAME',
    treeNodeDescription: 'TNO_ABSTRACT'
  },
  applicationTemplateIdentificator: "PRINT_TEMPLATE",
  capabilitiesRequest: {
    simpleRequest: 'request=GetCapabilities',
    requestWithWMS: 'request=GetCapabilities%26service=WMS',
    WFSIdentificator: 'WFS',
    WMSIdentificator: 'WMS',

  }
};
