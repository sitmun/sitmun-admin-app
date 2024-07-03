import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component } from '@angular/core';
import { SidenavService } from '../../../services/sidenav.service';
import { LoginService} from '../../../frontend-core/src/lib/public_api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent{
  langList: any = [];
  constructor(private sidenav: SidenavService, public loginService:LoginService, private router: Router) { }

  @Output()
  open: EventEmitter<boolean> = new EventEmitter()

  clickMenu(){ 
    this.open.emit(true);
  }

  clickLogo(){
    this.router.navigate(['dashboard'])
  }

  
  /** User log out*/
  logout(){
    this.loginService.logout();
  }
}
