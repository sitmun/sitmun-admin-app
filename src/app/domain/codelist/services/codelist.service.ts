import { CodeList } from '@app/domain';
import { Injectable, Injector } from '@angular/core';
import { RestService } from '@app/core/hal/rest/rest.service';

/** Connection manager service */
@Injectable()
export class CodeListService extends RestService<CodeList> {

  /** constructor */
  constructor(injector: Injector) {
    super(CodeList, "codelist-values", injector);
  }

}
