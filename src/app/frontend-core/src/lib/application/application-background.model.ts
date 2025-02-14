import {Resource} from '../angular-hal/src/lib/resource';
import {Background} from '../cartography/background.model';
import {Application} from './application.model'; 

/**
 * Application background model
 */
export class ApplicationBackground extends Resource {
  /** order*/
  public order: number;
  
  /** background*/
  public background: Background;
  
  /** application*/
  public application: Application;

}
