/** Canonical view mode codes for tree nodes (treenode.viewmode). Single source for nodeViewModes keys and nodeMapping.views. */
const nodeViewModeCodes: Record<string, string> = {
  detailedList: 'dl',
  routes: 'rt',
  nearElements: 'ne',
  schedule: 'sch',
  events: 'evt',
  eventsCategories: 'evtcat',
  eventsLocations: 'evtloc',
  mapSearch: 'ms',
  gallery: 'gallery'
};

export const config = {
  agGridTheme: "ag-theme-balham",
  scopeTypes: ['selectType', 'Municipal', 'Supramunicipal', 'Total'],
  tasksTypes: {
    'edit': 0,
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
    cartographyDescription : 'Cartography.description',
    territoryName : 'Territory.name',
    serviceDescription: 'Service.description',
    applicationName: 'name',
    applicationDescription: 'description',
    applicationTitle: 'title',
    backgroundName: 'name',
    backgroundDescription: 'description',
    treeName: 'Tree.name',
    treeDescription: 'Tree.description',
    treeNodeName: 'TreeNode.name',
    treeNodeDescription: 'TreeNode.description',
  },
  applicationTemplateIdentificator: "PRINT_TEMPLATE",
  capabilitiesRequest: {
    simpleRequest: 'request=GetCapabilities',
    requestWithWMS: 'request=GetCapabilities%26service=WMS',
    WFSIdentificator: 'WFS',
    WMSIdentificator: 'WMS',

  },
  /** Material icon per node view mode code (keys = nodeViewModeCodes). Fallback for unknown codes. */
  nodeViewModes: {
    [nodeViewModeCodes.detailedList]: { icon: 'view_list' },
    [nodeViewModeCodes.routes]: { icon: 'route' },
    [nodeViewModeCodes.nearElements]: { icon: 'near_me' },
    [nodeViewModeCodes.schedule]: { icon: 'schedule' },
    [nodeViewModeCodes.events]: { icon: 'event' },
    [nodeViewModeCodes.eventsCategories]: { icon: 'event' },
    [nodeViewModeCodes.eventsLocations]: { icon: 'event' },
    [nodeViewModeCodes.mapSearch]: { icon: 'map' },
    [nodeViewModeCodes.gallery]: { icon: 'photo_library' }
  },
  nodeViewModeFallbackIcon: 'list',
  nodeMapping: {
    nodeOutputControls: [{
      key: 'id',
      label: 'nodeMapping.id',
      views: [
        nodeViewModeCodes.detailedList,
        nodeViewModeCodes.routes,
        nodeViewModeCodes.nearElements,
        nodeViewModeCodes.schedule,
        nodeViewModeCodes.events,
        nodeViewModeCodes.mapSearch,
        nodeViewModeCodes.gallery
      ]
    },
    {
      key: 'name',
      label: 'nodeMapping.name',
      views: [
        nodeViewModeCodes.detailedList,
        nodeViewModeCodes.routes,
        nodeViewModeCodes.nearElements,
        nodeViewModeCodes.schedule,
        nodeViewModeCodes.events,
        nodeViewModeCodes.eventsCategories,
        nodeViewModeCodes.eventsLocations,
        nodeViewModeCodes.mapSearch
      ]
    },
    {
      key: 'distance',
      label: 'nodeMapping.distance',
      views: [nodeViewModeCodes.nearElements]
    },
    {
      key: 'description',
      label: 'nodeMapping.description',
      views: [
        nodeViewModeCodes.detailedList,
        nodeViewModeCodes.routes,
        nodeViewModeCodes.events
      ]
    },
    {
      key: 'category',
      label: 'nodeMapping.category',
      views: [nodeViewModeCodes.events]
    },
    {
      key: 'image',
      label: 'nodeMapping.image',
      views: [
        nodeViewModeCodes.detailedList,
        nodeViewModeCodes.routes,
        nodeViewModeCodes.nearElements,
        nodeViewModeCodes.events,
        nodeViewModeCodes.gallery
      ]
    },
    {
      key: 'leftbtnLabel',
      label: 'nodeMapping.leftbtnLabel',
      views: [nodeViewModeCodes.detailedList, nodeViewModeCodes.routes]
    },
    {
      key: 'leftbtn',
      label: 'nodeMapping.leftbtn',
      views: [nodeViewModeCodes.detailedList, nodeViewModeCodes.routes]
    },
    {
      key: 'rightbtnLabel',
      label: 'nodeMapping.rightbtnLabel',
      views: [nodeViewModeCodes.detailedList, nodeViewModeCodes.routes]
    },
    {
      key: 'rightbtn',
      label: 'nodeMapping.rightbtn',
      views: [nodeViewModeCodes.detailedList, nodeViewModeCodes.routes]
    },
    {
      key: 'hour',
      label: 'nodeMapping.hour',
      views: [nodeViewModeCodes.schedule]
    },
    {
      key: 'startdate',
      label: 'nodeMapping.startdate',
      views: [nodeViewModeCodes.events]
    },
    {
      key: 'enddate',
      label: 'nodeMapping.enddate',
      views: [nodeViewModeCodes.events]
    },
    {
      key: 'address',
      label: 'nodeMapping.address',
      views: [nodeViewModeCodes.events]
    },
    {
      key: 'muni',
      label: 'nodeMapping.town',
      views: [nodeViewModeCodes.events]
    },
    {
      key: 'length',
      label: 'nodeMapping.length',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'difficulty',
      label: 'nodeMapping.difficulty',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'time',
      label: 'nodeMapping.time',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'start',
      label: 'nodeMapping.start',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'end',
      label: 'nodeMapping.end',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'circ',
      label: 'nodeMapping.circ',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'graphic',
      label: 'nodeMapping.graphic',
      views: [nodeViewModeCodes.routes]
    },
    {
      key: 'path',
      label: 'nodeMapping.path',
      views: [nodeViewModeCodes.schedule]
    },
    {
      key: 'geom',
      label: 'nodeMapping.geometry',
      views: [
        nodeViewModeCodes.detailedList,
        nodeViewModeCodes.routes,
        nodeViewModeCodes.nearElements,
        nodeViewModeCodes.events,
        nodeViewModeCodes.mapSearch
      ]
    },
    {
      key: 'proj',
      label: 'nodeMapping.proj',
      views: [
        nodeViewModeCodes.detailedList,
        nodeViewModeCodes.routes,
        nodeViewModeCodes.nearElements,
        nodeViewModeCodes.events,
        nodeViewModeCodes.mapSearch
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
    }, {
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
  },
  treeTypeNodeTypes: {
    cartography: {
      allowedRootTypes: ['folder'],
      nodeTypes: {
        folder: {
          allowedChildren: ['cartography', 'folder'],
          icon: 'folder',
          showDescriptionPanel: true,
          showMetadataFieldsInDescriptionPanel: true,
          showCartographyPanel: false,
          showAppearancePanel: false,
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        },
        cartography: {
          allowedChildren: [],
          icon: 'stacks',
          iconFont: 'material-symbols-outlined',
          showDescriptionPanel: true,
          showMetadataFieldsInDescriptionPanel: true,
          showFiltersPanel: true,
          showCartographyPanel: true,
          showAppearancePanel: false,
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        }
      }
    },
    touristic: {
      allowedRootTypes: ['menu'],
      nodeTypes: {
        menu: {
          allowedChildren: ['list', 'task', 'map', 'fav', 'nm', 'menu'],
          icon: 'apps',
          showDescriptionPanel: false,
          showCartographyPanel: false,
          showAppearancePanel: true,
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        },
        list: {
          allowedChildren: ['list', 'task', 'map'],
          icon: 'list',
          /** i18n key for appearance field label: 'image' (custom image) vs 'icon' (Material icon name). */
          appearanceLabelKey: 'image',
          showDescriptionPanel: true,
          showCartographyPanel: false,
          showAppearancePanel: true,
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        },
        task: {
          allowedChildren: ['task'],
          icon: 'sync',
          /** When true, show folder hint for task-group container nodes (no task + no view mode). */
          folderHintForTaskGroupContainer: true,
          showDescriptionPanel: false,
          showCartographyPanel: false,
          /** Show appearance panel when parent is one of these (e.g. menu). Default false if absent. */
          showAppearancePanelWhenParentIs: ['menu'],
          showTaskPanel: true,
          showFilterableInTaskPanel: true,
          showMappingInTaskPanel: true,
          showDisplayOptionsPanel: true
        },
        map: {
          allowedChildren: ['task'],
          icon: 'map',
          showDescriptionPanel: false,
          showCartographyPanel: false,
          showAppearancePanelWhenParentIs: ['menu'],
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        },
        fav: {
          allowedChildren: [],
          icon: 'favorite',
          showDescriptionPanel: false,
          showCartographyPanel: false,
          showAppearancePanelWhenParentIs: ['menu'],
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        },
        nm: {
          allowedChildren: ['task'],
          icon: 'track_changes',
          childrenMustBeLeaves: true,
          showDescriptionPanel: false,
          showCartographyPanel: false,
          showAppearancePanelWhenParentIs: ['menu'],
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        }
      }
    },
    edition: {
      allowedRootTypes: ['folder'],
      nodeTypes: {
        folder: {
          allowedChildren: ['cartography', 'folder'],
          icon: 'folder',
          showDescriptionPanel: true,
          showMetadataFieldsInDescriptionPanel: true,
          showCartographyPanel: false,
          showAppearancePanel: false,
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        },
        cartography: {
          allowedChildren: [],
          icon: 'stacks',
          iconFont: 'material-symbols-outlined',
          showDescriptionPanel: true,
          showMetadataFieldsInDescriptionPanel: true,
          showFiltersPanel: true,
          showCartographyPanel: true,
          showAppearancePanel: false,
          showTaskPanel: false,
          showDisplayOptionsPanel: true
        }
      }
    }
  }
};
