import { Resource } from '../angular-hal/src/lib/resource';
import { Connection } from '../connection/connection.model';
import { ServiceParameter } from './service-parameter.model';
/**
 * Service model
 */
export declare class Service extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** url*/
    url: string;
    /** projections*/
    projections: string;
    /** legend*/
    legend: string;
    /** infoUrl*/
    infoUrl: string;
    /** system created date*/
    createdDate: any;
    /** connection*/
    connection: Connection;
    /** parameters*/
    parameters: ServiceParameter[];
}
