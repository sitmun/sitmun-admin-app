import {Injectable, Injector} from '@angular/core';
import {RestService} from '@app/core/hal/rest/rest.service';
import {TerritoryType} from '@app/domain';

/** TerritoryType manager service */
@Injectable()
export class TerritoryTypeService extends RestService<TerritoryType> {

  /** constructor */
  constructor(injector: Injector) {
    super(TerritoryType, "territory-types", injector);
  }

}
