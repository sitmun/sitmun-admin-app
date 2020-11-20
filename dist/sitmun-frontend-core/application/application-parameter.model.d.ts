import { Resource } from '../angular-hal/src/lib/resource';
import { Application } from './application.model';
/**
 * Application parameter model
 */
export declare class ApplicationParameter extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** value*/
    value: string;
    /** application*/
    application: Application;
}
