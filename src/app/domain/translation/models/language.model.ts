import { Resource } from '@app/core/hal/resource/resource.model';


/** Task model */
export class Language extends Resource {
  /** id */
  public id: number;
  /** name */
  public shortname: string;
  /** name */
  public name: string;
}
