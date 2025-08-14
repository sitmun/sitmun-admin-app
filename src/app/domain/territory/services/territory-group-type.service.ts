import { TerritoryGroupType } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from '@app/core/hal/rest/rest.service';
@Injectable({
  providedIn: 'root'
})
export class TerritoryGroupTypeService extends RestService<TerritoryGroupType> {

  /** constructor */
  constructor(injector: Injector) {
    super(TerritoryGroupType, "territory-group-types", injector);
  }

}
