import {Component} from '@angular/core';

@Component({
  selector: 'app-authenticated-layout',
  template: `
    <div class="mat-app-background basic-container">
      <app-toolbar (sidenavEvent)="navOpen($event)"></app-toolbar>
      <app-side-menu [openNav]="isOpen"></app-side-menu>
    </div>
  `,
  styles: []
})
export class AuthenticatedLayoutComponent {
  isOpen = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  navOpen(_: any): void {
    this.isOpen = !this.isOpen;
  }
}


