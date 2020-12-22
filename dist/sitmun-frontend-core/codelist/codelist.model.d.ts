import { Resource } from '../angular-hal/src/lib/resource';
/**
 * Connection model
 */
export declare class CodeList extends Resource {
    /** id */
    id: number;
    /** name*/
    codeListName: string;
    /** type*/
    value: string;
    /** user*/
    description: string;
}
