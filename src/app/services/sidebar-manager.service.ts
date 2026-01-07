import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SidebarType = 'error' | 'translation' | null;

@Injectable({
  providedIn: 'root'
})
export class SidebarManagerService {
  private activeSidebarSubject = new BehaviorSubject<SidebarType>(null);
  
  get activeSidebar$(): Observable<SidebarType> {
    return this.activeSidebarSubject.asObservable();
  }

  openSidebar(type: SidebarType): void {
    // Close any other sidebar first (mutually exclusive)
    this.activeSidebarSubject.next(type);
  }

  closeSidebar(): void {
    this.activeSidebarSubject.next(null);
  }

  getActiveSidebar(): SidebarType {
    return this.activeSidebarSubject.value;
  }
}




