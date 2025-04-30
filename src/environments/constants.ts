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
  treeType: {
    touristicTree: 'tourist',
    cartography: 'cartography'
  },
  treenodeFolderType: {
    menu: 'menu',
    list: 'list',
    cartography: 'cartography',
    map: 'map',
    favorites: 'fav'
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
    eventsCategories: 'evtcat'
  },
  systemUser: {
    public: 'public',
  },
  serviceAuthenticationMode: {
    none: 'None'
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
        icon: 'menu_connexio',
        children: null,
      },
      {
        id: 'service',
        icon: 'menu_servei',
        children: null,
      },
      {
        id: 'layers',
        icon: 'menu_capes',
        children: null,
      },
      {
        id: 'trees',
        icon: 'menu_arbres',
        children: null,
      },
      {
        id: 'backgroundLayers',
        icon: 'menu_capes_fons',
        children: null,
      }
    ],
    [
      {
        id: 'layersPermits',
        icon: 'menu_permisos',
        children: null,
      },
      {
        id: 'territory',
        icon: 'menu_territori',
        children: null,
      },
      {
        id: 'role',
        icon: 'menu_rol',
        children: null,
      },
      {
        id: 'user',
        icon: 'menu_usuari',
        children: null,
      },
    ],
    [
      /*
        {
          id: 'taskGroup',
          icon: 'ic_gruptasca',
          children: null,
        }, */
      {
        id: 'tasks',
        icon: 'menu_tasques',
        children: [
          {
            id: 'tasksBasic',
            translation: 'basics',
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
        codeValue.taskViewMode.events
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
        codeValue.taskViewMode.eventsCategories
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
      key: 'price',
      label: 'nodeMapping.price',
      views: [
        codeValue.taskViewMode.detailedList
      ]
    },
    {
      key: 'schedule',
      label: 'nodeMapping.schedule',
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
      key: 'dateformat',
      label: 'nodeMapping.dateformat',
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
        codeValue.taskViewMode.events
      ]
    },
    {
      key: 'proj',
      label: 'nodeMapping.proj',
      views: [
        codeValue.taskViewMode.detailedList,
        codeValue.taskViewMode.nearElements,
        codeValue.taskViewMode.events
      ]
    }],
    appOptions: [{
      label: 'X',
      value: '${LATITUD}'
    }, {
      label: 'Y',
      value: '${LONGITUD}'
    }, {
      label: 'Fecha desde',
      value: '${STARTDATE}'
    }, {
      label: 'Fecha hasta',
      value: '${ENDDATE}'
    }, {
      label: 'Distancia en eje x',
      value: '${DISTANCEX}'
    }, {
      label: 'Distancia en eje y',
      value: '${DISTANCEY}'
    }]
  }
};
