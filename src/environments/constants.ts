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
    touristicTree: 'touristic',
    cartography: 'cartography'
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
    eventsCategories: 'evtcat'
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
      key: 'address',
      label: 'nodeMapping.address',
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
    }]
  }
};
