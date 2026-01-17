import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {IconsService} from './icons.service';
import {LoggerService} from './logger.service';
import {UtilsService} from './utils.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    IconsService,
    UtilsService,
    LoggerService
  ]
})
export class ServicesModule {
}
