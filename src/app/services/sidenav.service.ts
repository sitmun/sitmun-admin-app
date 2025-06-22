import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggerService } from '@app/services/logger.service';

/**
 * Service to manage the state of the application's side navigation
 */
@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenav: MatSidenav;
  private sideNavToggleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(private loggerService: LoggerService) {}
  
  /**
   * Get the current sidenav toggle state as an Observable
   */
  public get sideNavToggle$(): Observable<boolean> {
    return this.sideNavToggleSubject.asObservable();
  }

  /**
   * Set the sidenav instance to be controlled by this service
   * @param sidenav The MatSidenav instance
   */
  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  /**
   * Toggle the sidenav open/closed state
   */
  public toggle(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
      this.sideNavToggleSubject.next(this.sidenav.opened);
    } else {
      this.sideNavToggleSubject.next(false);
      this.loggerService.warn('SidenavService: No sidenav instance has been set');
    }
  }

  /**
   * Open the sidenav
   */
  public open(): void {
    if (this.sidenav) {
      this.sidenav.open();
      this.sideNavToggleSubject.next(true);
    }
  }

  /**
   * Close the sidenav
   */
  public close(): void {
    if (this.sidenav) {
      this.sidenav.close();
      this.sideNavToggleSubject.next(false);
    }
  }

  /**
   * Check if the sidenav is open
   * @returns True if the sidenav is open, false otherwise
   */
  public isOpen(): boolean {
    return this.sidenav ? this.sidenav.opened : false;
  }
}