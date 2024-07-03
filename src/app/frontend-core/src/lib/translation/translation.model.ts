import {Resource} from '../angular-hal/src/lib/resource';
import { Language } from './language.model';


/** Task model */
export class Translation extends Resource {
  /** id */
  public id: number;
  /** id */
  public element: number;
  /** name */
  public translation: string;
  /** column */
  public column: string;
  /** name */
  public language: Language;
  /** name */
  public languageName?: string;
  /** name */
  public languageShortname?: string;



}
