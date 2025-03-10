import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { constants } from '@environments/constants';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  private readonly iconBasePath = 'assets/img/';
  private loadedIcons: Set<string> = new Set();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  /**
   * Loads all SVG icons defined in the constants
   */
  loadSVGs(): void {
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
      console.error(`Failed to load icon: ${iconName}`, error);
      return false;
    }
  }

  /**
   * Loads all menu icons from constants
   */
  private loadMenuIcons(): void {
    for (const menuOptions of constants.menus) {
      for (const key in menuOptions) {
        const option = menuOptions[key];
        if (option && option.icon) {
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
      if (option && option.icon) {
        this.loadIcon(option.icon);
      }
    }
  }
}
