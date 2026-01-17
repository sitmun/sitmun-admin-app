import { Injectable, Injector } from '@angular/core';

import { RestService } from '@app/core/hal/rest/rest.service';

import { TerritoryGroupType } from '../models/territory-group-type.model';

@Injectable({
  providedIn: 'root'
})
export class TerritoryGroupTypeService extends RestService<TerritoryGroupType> {

  /** constructor */
  constructor(injector: Injector) {
    super(TerritoryGroupType, "territory-group-types", injector);
  }

}
