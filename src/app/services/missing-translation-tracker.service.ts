import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tracks translation keys that were requested but not found in the current language.
 * Used by the dev-menu "Missing Translations" sidebar (non-production only).
 */
@Injectable({
  providedIn: 'root'
})
export class MissingTranslationTrackerService {
  private keys = new Set<string>();
  private keysSubject = new BehaviorSubject<string[]>([]);

  get keys$(): Observable<string[]> {
    return this.keysSubject.asObservable();
  }

  addKey(key: string): void {
    if (!key || this.keys.has(key)) {
      return;
    }
    this.keys.add(key);
    this.keysSubject.next([...this.keys].sort());
  }

  getKeys(): string[] {
    return [...this.keys].sort();
  }

  clear(): void {
    this.keys.clear();
    this.keysSubject.next([]);
  }

  getCount(): number {
    return this.keys.size;
  }
}
