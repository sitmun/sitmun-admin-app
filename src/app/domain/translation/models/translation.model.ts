import {Resource} from '@app/core/hal/resource/resource.model';

import {Language} from './language.model';


/** Task model */
export class Translation extends Resource {
  public override id: number;
  public element: number;
  public translation: string;
  /** column */
  public column: string;
  public language: Language;
  public languageName?: string;
  public languageShortname?: string;

}
