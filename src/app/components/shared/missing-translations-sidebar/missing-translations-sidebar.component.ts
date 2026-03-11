import { Component, HostListener } from '@angular/core';

import { MissingTranslationTrackerService } from '@app/services/missing-translation-tracker.service';
import { SidebarManagerService } from '@app/services/sidebar-manager.service';

@Component({
  selector: 'app-missing-translations-sidebar',
  templateUrl: './missing-translations-sidebar.component.html',
  styleUrls: ['./missing-translations-sidebar.component.scss'],
  standalone: false
})
export class MissingTranslationsSidebarComponent {
  keys$ = this.tracker.keys$;

  constructor(
    private tracker: MissingTranslationTrackerService,
    private sidebarManager: SidebarManagerService
  ) {}

  close(): void {
    this.sidebarManager.closeSidebar();
  }

  isOpen(): boolean {
    return this.sidebarManager.getActiveSidebar() === 'translation';
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(_event: Event): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  clearAll(): void {
    this.tracker.clear();
  }

  copyKey(key: string): void {
    navigator.clipboard.writeText(key).catch(() => {});
  }

  copyAllKeys(): void {
    const text = this.tracker.getKeys().join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  }
}
