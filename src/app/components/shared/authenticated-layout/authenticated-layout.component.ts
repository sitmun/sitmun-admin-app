import {Component, OnInit} from '@angular/core';

import {LoggerService} from '@app/services/logger.service';

@Component({
    selector: 'app-authenticated-layout',
    template: `
    <div class="mat-app-background basic-container">
      <app-toolbar (sidenavEvent)="navOpen($event)"></app-toolbar>
      <app-side-menu [openNav]="isOpen"></app-side-menu>
      <app-error-details-sidebar></app-error-details-sidebar>
    </div>
  `,
    styles: [],
    standalone: false
})
export class AuthenticatedLayoutComponent implements OnInit {
  isOpen = false;

  constructor(private readonly loggerService: LoggerService) {}

  ngOnInit(): void {
    this.loggerService.debug('[AuthenticatedLayoutComponent] Initialized');
  }

   
  navOpen(_: any): void {
    this.isOpen = !this.isOpen;
  }
}