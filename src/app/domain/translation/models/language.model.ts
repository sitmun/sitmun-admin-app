import { Resource } from '@app/core/hal';


/** Task model */
export class Language extends Resource {
  /** id */
  public id: number;
  /** name */
  public shortname: string;
  /** name */
  public name: string;
}
