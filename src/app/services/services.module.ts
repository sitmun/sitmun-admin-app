import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IconsService} from './icons.service';
import {UtilsService} from './utils.service';
import {LoggerService} from './logger.service';

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
