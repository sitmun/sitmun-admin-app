import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {IconsService} from '@app/services/icons.service';
import {Configuration} from '@app/core/config/configuration';
import {LoggerService} from "@app/services/logger.service";


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnChanges, OnInit {

  menus: any = [[]];

  loaded = false;

  @Input()
  openNav: boolean;

  @ViewChild('sidenav') public sidenav: MatSidenav;

  constructor(
    private readonly iconsService: IconsService,
    private readonly loggerService: LoggerService,
  ) {
    this.menus = [
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
  }

  ngOnInit() {
    this.iconsService.loadSVGs().then(() => {
      this.loaded = true;
    });
  }

  ngOnChanges(): void {
    if (this.sidenav) {
      this.sidenav.toggle().catch((error: any) => {
        this.loggerService.error("Sidenav toggle failed:", error);
      });
    }
  }
}

