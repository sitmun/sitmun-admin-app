import { Injectable} from '@angular/core';
import { TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private translate: TranslateService) {}

  getTranslate(msg) {
      return this.translate.instant(msg) ;
  }

}
