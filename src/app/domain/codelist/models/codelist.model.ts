import { Resource } from '@app/core/hal';
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
