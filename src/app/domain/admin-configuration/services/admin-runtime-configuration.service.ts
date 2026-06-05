import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map, shareReplay } from 'rxjs';

import { ResourceService } from '@app/core/hal';

import { AdminConfiguration, TreeImageUploadConfiguration } from '../models/admin-configuration.model';

/** Loads and caches the admin runtime configuration from GET /api/config/admin. */
@Injectable({
  providedIn: 'root',
})
export class AdminRuntimeConfigurationService {

  private readonly config$: Observable<AdminConfiguration>;

  constructor(private http: HttpClient, private resourceService: ResourceService) {
    this.config$ = this.http
      .get<AdminConfiguration>(this.resourceService.getResourceUrl('config/admin'))
      .pipe(shareReplay(1));
  }

  getTreeImageUploadConfiguration(): Observable<TreeImageUploadConfiguration> {
    return this.config$.pipe(map((c) => c.imageUpload.tree));
  }
}
