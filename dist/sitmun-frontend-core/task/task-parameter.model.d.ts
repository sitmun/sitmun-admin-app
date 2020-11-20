import { Resource } from '../angular-hal/src/lib/resource';
import { Task } from './task.model';
/**
 * Task parameter model
 */
export declare class TaskParameter extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** value*/
    value: string;
    /** order*/
    order: Number;
    /** task*/
    task: Task;
}
