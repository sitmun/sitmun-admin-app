import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoggerService} from "@app/services/logger.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent{
  @Output()
  sidenavEvent: EventEmitter<boolean> = new EventEmitter()

  constructor(
    private readonly router: Router,
    private readonly loggerService: LoggerService
  ) {
  }

  clickMenu() {
    this.sidenavEvent.emit(true);
  }

  clickLogo(){
    this.router.navigate(['dashboard']).catch((error) => this.loggerService.error("Cannot navigate to the dashboard", error));
  }
}
