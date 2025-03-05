export const constants = {
  codeValue: {
    applicationType: {
      turisticApp: 'T',
      externalApp: 'E',
      internalApp: 'I'
    },
    treeType: {
      turisticTree: 'tourist',
    },
    treenodeFolderType: {
      menu: 'menu',
      list: 'list',
      cartography: 'cartography',
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
    systemUser: {
      public: 'public',
    },
    serviceAuthenticationMode: {
      none: 'None'
    },
    serviceType: {
      wms: 'WMS'
    }
  },
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
            id: 'tasks',
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
  ]
};
