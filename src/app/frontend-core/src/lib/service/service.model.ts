import {Resource} from '../angular-hal/src/lib/resource';
import {Connection} from '../connection/connection.model';
import {ServiceParameter} from './service-parameter.model';
/**
 * Service model
 */
export class Service extends Resource {
  /** id */
  public id: number;
  /** name*/
  public name: string;
    
  /** type*/
  public type: string;

  /** url*/  
  public serviceURL: string;

  /** projections*/  
  public supportedSRS: string;
  
  /** legend*/
  public legend: string;

  /** infoUrl*/  
  public infoUrl: string;
  
  /** system created date*/
  public createdDate: any;

  /** connection*/
  public connection: Connection;
  
  /** parameters*/  
  public parameters: ServiceParameter[];

  /** whether service is blocked*/
  public blocked: boolean;
}
