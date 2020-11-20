import { Resource } from '../angular-hal/src/lib/resource';
import { Background } from '../cartography/background.model';
import { Application } from './application.model';
/**
 * Application background model
 */
export declare class ApplicationBackground extends Resource {
    /** order*/
    order: Number;
    /** background*/
    background: Background;
    /** application*/
    application: Application;
}
