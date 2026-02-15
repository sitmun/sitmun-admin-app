import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

import {Principal} from '@app/core/auth/principal.service';
import {Configuration} from '@app/core/config/configuration';
import {IconsService} from '@app/services/icons.service';
import {LoggerService} from "@app/services/logger.service";


@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    standalone: false
})
export class SideMenuComponent implements OnChanges, OnInit {

  menus: any = [[]];

  loaded = false;

  isAdmin = false;

  @Input()
  openNav: boolean;

  @ViewChild('sidenav') public sidenav: MatSidenav;

  constructor(
    private readonly iconsService: IconsService,
    private readonly loggerService: LoggerService,
    private readonly principal: Principal,
  ) {
    // Menus will be initialized in ngOnInit after checking user permissions
  }

  ngOnInit() {
    this.loggerService.debug('[SideMenuComponent] ngOnInit called');
    
    // Check if user is the built-in admin user (username "admin" AND administrator flag)
    this.principal.identity().then((user) => {
      if (user && user.username === 'admin' && user.administrator === true) {
        this.isAdmin = true;
        this.loggerService.debug('[SideMenuComponent] User is built-in admin with administrator flag, showing System menu');
      } else {
        this.isAdmin = false;
        this.loggerService.debug('[SideMenuComponent] User does not meet admin criteria (username: ' + (user?.username || 'unknown') + ', administrator: ' + (user?.administrator || false) + '), hiding System menu');
      }
      this.updateMenus();
    }).catch((error) => {
      this.loggerService.error('[SideMenuComponent] Failed to load user identity:', error);
      this.isAdmin = false;
      this.updateMenus();
    });

    this.iconsService.loadSVGs().then(() => {
      this.loggerService.debug('[SideMenuComponent] Icons loaded successfully');
      this.loaded = true;
    }).catch((error) => {
      this.loggerService.error('[SideMenuComponent] Failed to load SVG icons:', error);
      // Still set loaded to true to allow the menu to render
      this.loaded = true;
    });
  }

  private updateMenus() {
    const baseMenus = [
      [
        Configuration.toMenuItem(Configuration.DASHBOARD)
      ],
      [
        Configuration.toMenuItem(Configuration.CONNECTION),
        Configuration.toMenuItem(Configuration.SERVICE),
        Configuration.toMenuItem(Configuration.LAYER),
        Configuration.toMenuItem(Configuration.TREE),
        Configuration.toMenuItem(Configuration.BACKGROUND_LAYER)
      ],
      [
        Configuration.toMenuItem(Configuration.LAYERS_PERMIT),
        Configuration.toMenuItem(Configuration.TERRITORY),
        Configuration.toMenuItem(Configuration.ROLE),
        Configuration.toMenuItem(Configuration.USER)
      ],
      [
        Configuration.toMenuItem(Configuration.TASK_GROUP),
        {
          ...Configuration.toMenuItem(Configuration.TASK),
          children: [
            Configuration.toMenuItem(Configuration.TASK_BASIC),
            Configuration.toMenuItem(Configuration.TASK_QUERY),
            Configuration.toMenuItem(Configuration.TASK_EDIT)
          ]
        }
      ],
      [
        Configuration.toMenuItem(Configuration.APPLICATION)
      ]
    ];

    // Only add System menu for the built-in admin user (username "admin" with administrator flag)
    if (this.isAdmin) {
      baseMenus.push([
        {
          id: 'system',
          label: 'menu.system',
          icon: 'settings',
          font: 'material-icons-round',
          children: [
            Configuration.toMenuItem(Configuration.TASK_UI),
            Configuration.toMenuItem(Configuration.LANGUAGE),
            Configuration.toMenuItem(Configuration.CODELIST_VALUE),
            Configuration.toMenuItem(Configuration.CONFIGURATION_PARAMETER)
          ]
        }
      ]);
    }

    this.menus = baseMenus;
  }

  ngOnChanges(): void {
    if (this.sidenav) {
      this.sidenav.toggle().catch((error: any) => {
        this.loggerService.error("Sidenav toggle failed:", error);
      });
    }
  }
}

