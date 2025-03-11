import { Component, OnInit } from '@angular/core';
import { Principal } from '@app/core/auth/principal.service';
import { LoginService } from '@app/core/auth/login.service';
import { User } from '@app/domain';

@Component({
  selector: 'app-user-info',
  template: `
    <div class="toolbar-control">
      <button mat-button [matMenuTriggerFor]="userMenu" class="toolbar-button">
        <mat-icon class="toolbar-icon">account_circle</mat-icon>
        <span class="toolbar-text" *ngIf="currentUser">{{ getUserFullName() }}</span>
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>{{ 'loginEntity.closeSession' | translate }}</span>
        </button>
      </mat-menu>
    </div>
  `,
})
export class UserInfoComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private principal: Principal,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUser();
    
    // Subscribe to authentication state changes
    this.principal.getAuthenticationState().subscribe(() => {
      this.loadCurrentUser();
    });
  }

  loadCurrentUser(): void {
    this.principal.identity().then((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.loginService.logout();
  }

  getUserFullName(): string {
    if (this.currentUser) {
      if (this.currentUser.firstName && this.currentUser.lastName) {
        return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      } else if (this.currentUser.firstName) {
        return this.currentUser.firstName;
      } else if (this.currentUser.lastName) {
        return this.currentUser.lastName;
      } else {
        return this.currentUser.username;
      }
    }
    return '';
  }
} 