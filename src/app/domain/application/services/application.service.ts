import {Injectable, Injector} from '@angular/core';

import {Observable} from 'rxjs';

import {RestService} from '@app/core/hal/rest/rest.service';

import {Application} from '../models/application.model';

/** Application manager service */
@Injectable()
export class ApplicationService extends RestService<Application> {

  /** constructor */
  constructor(injector: Injector) {
    super(Application, "applications", injector);
  }

  /** Fetches applications where the given user is the creator (point of contact). */
  findByCreatorId(userId: number): Observable<Application[]> {
    return this.search('findByCreatorId', {params: [{key: 'creatorId', value: userId}], notPaged: true});
  }
}
