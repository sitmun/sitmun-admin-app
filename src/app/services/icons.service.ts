import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {constants} from '../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) { }

    loadSVGs(){
      let menuOptions: any;
      for ( menuOptions of constants.menus)
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
      for ( const key in constants.extraImg ) {
        const option = constants.extraImg[key];
        const icon = option.icon;

        this.matIconRegistry.addSvgIcon(
          icon,
          this.domSanitizer.bypassSecurityTrustResourceUrl('assets/img/' + icon + '.svg')
        );
      }
    }
}
