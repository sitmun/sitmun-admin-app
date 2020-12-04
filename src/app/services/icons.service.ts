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

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) { }

  loadOptions() {
    this.menuOptions1 = [
      {
        id: 'connection',
        icon: 'menu_connexio',
      },
      {
        id: 'service',
        icon: 'menu_servei',
      },
      {
        id: 'layers',
        icon: 'menu_capes',
      },
      {
        id: 'trees',
        icon: 'menu_arbres',
      },
      {
        id: 'backgroundLayers',
        icon: 'menu_capes_fons',
      }
      ];

    this.menuOptions2 = [
        {
          id: 'layersPermits',
          icon: 'menu_permisos',
        },
        {
          id: 'territory',
          icon: 'menu_territori',
        },
        {
          id: 'role',
          icon: 'menu_rol',
        },
        {
          id: 'user',
          icon: 'menu_usuari',
        },
      ];

    this.menuOptions3 = [
        {
          id: 'taskGroup',
          icon: 'ic_gruptasca'
        },
        {
          id: 'tasks',
          icon: 'menu_tasques',
          children: [
            {
              id: 'tasksDownload',
            },

            {
              id: 'tasksDocument',
            },

            {
              id: 'tasksConsultation',
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
            },

            {
              id: 'tasksThematic',
            },

            {
              id: 'tasksExtractionFME',
            },

          ]
        }
      ];

    this.menuOptions4 = [
      {
        id: 'application',
        icon: 'menu_aplicacio',
      }
    ];

    this.extraImg = [
        {
          id: 'ic_arrow_down_black',
          icon: 'ic_arrow_down_black',
        }
      ];

    this.menus[0] = this.menuOptions1;
    this.menus[1] = this.menuOptions2;
    this.menus[2] = this.menuOptions3;
    this.menus[3] = this.menuOptions4;

    }

    loadSVGs(){
      // tslint:disable-next-line: forin
      // tslint:disable-next-line: one-variable-per-declaration
      let menuOptions: any;
      for ( menuOptions of this.menus)
      {
        // tslint:disable-next-line: forin
        for (const key in menuOptions) {
          const option = menuOptions[key];
          const icon = option.icon;

          this.matIconRegistry.addSvgIcon(
            icon,
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/' + icon + '.svg')
          );
        }
      }
      // tslint:disable-next-line: forin
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
