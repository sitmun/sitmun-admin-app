import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsService } from './icons.service';
import { SidenavService } from './sidenav.service';
import { UtilsService } from './utils.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    IconsService,
    SidenavService,
    UtilsService
  ]
})
export class ServicesModule { } 