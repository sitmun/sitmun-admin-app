import {Injectable} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {constants} from '@environments/constants';
import {Configuration} from '@app/core/config/configuration';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  private readonly iconBasePath = 'assets/img/';

  private readonly loadedIcons: Set<string> = new Set();

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly loggerService: LoggerService
  ) { }

  /**
   * Loads all SVG icons defined in the constants
   */
  async loadSVGs(): Promise<void> {
    this.loadMenuIcons();
    this.loadExtraIcons();
  }

  /**
   * Loads a single SVG icon
   * @param iconName The name of the icon to load
   * @returns True if the icon was loaded, false if it was already loaded
   */
  loadIcon(iconName: string): boolean {
    if (this.loadedIcons.has(iconName)) {
      return false;
    }

    try {
      this.matIconRegistry.addSvgIcon(
        iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${this.iconBasePath}${iconName}.svg`)
      );
      this.loadedIcons.add(iconName);
      return true;
    } catch (error) {
      this.loggerService.error(`Failed to load icon: ${iconName}`, error);
      return false;
    }
  }

  /**
   * Loads all menu icons from constants
   */
  private loadMenuIcons(): void {
    const menus = [
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

    for (const menuOptions of menus) {
      for (const key in menuOptions) {
        const option = menuOptions[key];
        if (option?.icon) {
          this.loadIcon(option.icon);
        }
      }
    }
  }

  /**
   * Loads all extra icons from constants
   */
  private loadExtraIcons(): void {
    for (const key in constants.extraImg) {
      const option = constants.extraImg[key];
      if (option?.icon) {
        this.loadIcon(option.icon);
      }
    }
  }
}
