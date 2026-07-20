import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { ApplicationTree } from '../models/application-tree.model';

/** Application tree manager service */
@Injectable()
export class ApplicationTreeService extends RestService<ApplicationTree> {

  /** constructor */
  constructor(injector: Injector) {
    super(ApplicationTree, 'application-trees', injector);
  }
}
