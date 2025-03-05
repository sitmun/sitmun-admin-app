import {Component, ViewChild, OnChanges, Input} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {IconsService} from 'src/app/services/icons.service';
import {constants} from '../../../../environments/constants';


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
    private iconsservice: IconsService) {
    this.menus = constants.menus;
    this.iconsservice.loadSVGs();
  }

  ngOnChanges(): void {
    if (this.openNav != null) {
      this.sidenav.toggle();
    }
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }


}

