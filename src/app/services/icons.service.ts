import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  menuOptions1: any = [];
  menuOptions2: any = [];
  menuOptions3: any = [];
  menuOptions4: any = [];
  menus: any = [[]];
  extraImg: any = [];
  flagImg: any = [];

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) { }

  loadOptions() {
    this.menuOptions1 = [
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
      ];

    this.menuOptions2 = [
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
      ];

    this.menuOptions3 = [
        {
          id: 'taskGroup',
          icon: 'ic_gruptasca',
          children: null,
        },
        {
          id: 'tasks',
          icon: 'menu_tasques',
          children: [
            {
              id: 'tasks',
              translation: 'basics',
              children: null,
            }/*,
            {
              id: 'tasksDownload',
            },

            {
              id: 'tasksDocument',
            },

            {
              id: 'tasksQuery',
            },

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
            },*/

          ]
        }
      ];

    this.menuOptions4 = [
      {
        id: 'application',
        icon: 'menu_aplicacio',
        children: null,
      }
    ];

    this.extraImg = [
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

    ];


    this.menus[0] = this.menuOptions1;
    this.menus[1] = this.menuOptions2;
    this.menus[2] = this.menuOptions3;
    this.menus[3] = this.menuOptions4;

    }

    loadSVGs(){
      let menuOptions: any;
      for ( menuOptions of this.menus)
      {
        for (const key in menuOptions) {
          const option = menuOptions[key];
          const icon = option.icon;

          this.matIconRegistry.addSvgIcon(
            icon,
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/' + icon + '.svg')
          );
        }
      }
      for ( const key in this.extraImg ) {
        const option = this.extraImg[key];
        const icon = option.icon;

        this.matIconRegistry.addSvgIcon(
          icon,
          this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/' + icon + '.svg')
        );
      }
    }

    getMenuOption() {
      this.loadOptions();
      return this.menus;
    }

}
