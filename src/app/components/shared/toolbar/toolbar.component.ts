import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component } from '@angular/core';
import { SidenavService } from '../../../services/sidenav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent{
  langList: any = [];
  constructor(private sidenav: SidenavService) { }

  @Output()
  open: EventEmitter<boolean> = new EventEmitter()

  clickMenu(){ 
    this.open.emit(true);
  }

}
