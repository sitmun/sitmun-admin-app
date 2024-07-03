import {Resource} from '../angular-hal/src/lib/resource';
/**
 * Connection model
 */
export class CodeList extends Resource {
  /** id */
  public id: number;
  /** name*/
  public codeListName: string;
  /** type*/
  public value: string;
  /** user*/
  public description: string;


}
