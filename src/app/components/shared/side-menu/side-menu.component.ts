import { Component, ViewChild, OnChanges, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsService } from 'src/app/services/icons.service.service';
import { SidenavService } from '../../../services/sidenav.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnChanges {

  menus: any = [[]];

  @Input()
  openNav: boolean;

  @ViewChild('sidenav') public sidenav: MatSidenav;
  constructor(
    private sidenavService: SidenavService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private iconsservice: IconsService) {
      this.iconsservice.loadOptions();
      this.menus = this.iconsservice.getMenuOption();
      this.iconsservice.loadSVGs();
      }

      ngOnChanges(): void {
        if (this.openNav != null) {
        this.sidenav.toggle()
        }
      }

      toggleSidebar()
      {
        this.sidenav.toggle();
      }




}

