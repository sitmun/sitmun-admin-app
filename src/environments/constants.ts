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
  treenodeFolderType: {
    menu: 'menu',
    list: 'list',
    cartography: 'cartography',
    map: 'map',
    nearme: 'nm'
  },
  treenodeLeafType: {
    task: 'task',
    cartography: 'cartography',
  },
  cartographyPermissionType: {
    cartographyGroup: 'C',
    report: 'I',
    backgroundMap: 'F',
    locationMap: 'M'
  },
  taskViewMode: {
    detailedList: 'dl',
    nearElements: 'ne',
    schedule: 'sch',
    events: 'evt',
    eventsCategories: 'evtcat',
    eventsLocations: 'evtloc',
    mapSearch: 'ms'
  },
  systemUser: {
    public: 'public',
  },
  serviceType: {
    wms: 'WMS'
  }
};

export const constants = {
  codeValue,
  menus: [
    [
      {
        id: 'connection',
        label: 'entity.connection.label',
        icon: 'menu_connexio',
        children: null,
      },
      {
        id: 'service',
        label: 'entity.service.label',
        icon: 'menu_servei',
        children: null,
      },
      {
        id: 'layers',
        label: 'entity.layer.label',
        icon: 'menu_capes',
        children: null,
      },
      {
        id: 'trees',
        label: 'entity.tree.label',
        icon: 'menu_arbres',
        children: null,
      },
      {
        id: 'backgroundLayers',
        label: 'entity.background.label',
        icon: 'menu_capes_fons',
        children: null,
      }
    ],
    [
      {
        id: 'layersPermits',
        label: 'entity.permissionGroup.label',
        icon: 'menu_permisos',
        children: null,
      },
      {
        id: 'territory',
        label: 'entity.territory.label',
        icon: 'menu_territori',
        children: null,
      },
      {
        id: 'role',
        label: 'entity.role.label',
        icon: 'menu_rol',
        children: null,
      },
      {
        id: 'user',
        label: 'entity.user.label',
        icon: 'menu_usuari',
        children: null,
      },
    ],
    [
      {
        id: 'taskGroup',
        label: 'entity.taskGroup.label',
        icon: 'ic_gruptasca',
        children: null,
      },
      {
        id: 'tasks',
        label: 'entity.task.label',
        icon: 'menu_tasques',
        children: [
          {
            id: 'tasksBasic',
            label: 'entity.task.basic.label',
            children: null,
          },
          /*
          {
            id: 'tasksDownload',
            children: null,
          },

          {
            id: 'tasksDocument',
            children: null,
          },
          */
          {
            id: 'tasksQuery',
            label: 'entity.task.query.label',
            children: null,
          },
          {
            id: 'tasksEdit',
            label: 'entity.task.edit.label',
            children: null,
          },
          /*
          {
            id: 'tasksMoreInformation',
          },

          {
            id: 'tasksLocator',
          },

          {
            id: 'tasksReport',
          },

          {
            id: 'tasksEdition',
            children: [
              {
                id: 'tasksEditionCartographyTable',
                translation: 'cartographyTableWFT'
              },
              {
                id: 'tasksEditionDataTable',
                translation: 'dataTable',
              },
              {
                id: 'tasksEditionRelationTable',
                translation: 'relationTable',
              },
              {
                id: 'tasksEditionSearchView',
                translation: 'searchView',
              },
            ]
          },

          {
            id: 'tasksThematic',
          },

          {
            id: 'tasksExtractionFME',
          },
           */
        ]
      }
    ],
    [
      {
        id: 'application',
        label: 'entity.application.label',
        icon: 'menu_aplicacio',
        children: null,
      }
    ]
  ],
  extraImg: [
    {
      id: 'ic_arrow_down_black',
      icon: 'ic_arrow_down_black',
    },
    {
      id: 'ic_translate',
      icon: 'ic_translate',
    },
    {
      id: 'ic_translate',
      icon: 'ic_translate',
    },
    {
      id: 'icon_lang_ca',
      icon: 'flag_ca',
    },
    {
      id: 'icon_lang_en',
      icon: 'flag_en',
    },
    {
      id: 'icon_lang_es',
      icon: 'flag_es',
    },
    {
      id: 'icon_lang_oc',
      icon: 'flag_oc',
    },
    {
      id: 'icon_lang_fr',
      icon: 'flag_oc',
    },
  ],
  nodeMapping: {
    nodeOutputControls: [{
      key: 'id',
      label: 'nodeMapping.id',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.schedule,
        codeValue.taskViewMode.events,
        codeValue.taskViewMode.mapSearch
      ]
    },
    {
      key: 'name',
      label: 'nodeMapping.name',
      views: [
        codeValue.taskViewMode.detailedList,
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
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'leftbtnLabel',
      label: 'nodeMapping.leftbtnLabel',
      views: [
        codeValue.taskViewMode.detailedList
      ]
    },
    {
      key: 'leftbtn',
      label: 'nodeMapping.leftbtn',
      views: [
        codeValue.taskViewMode.detailedList
      ]
    },
    {
      key: 'rightbtnLabel',
      label: 'nodeMapping.rightbtnLabel',
      views: [
        codeValue.taskViewMode.detailedList
      ]
    },
    {
      key: 'rightbtn',
      label: 'nodeMapping.rightbtn',
      views: [
        codeValue.taskViewMode.detailedList
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
