import { Resource } from '../angular-hal/src/lib/resource';
import { Service } from './service.model';
/**
 * Service parameter model
 */
export declare class ServiceParameter extends Resource {
    /** name*/
    name: string;
    /** type*/
    type: string;
    /** value*/
    value: string;
    /** service*/
    service: Service;
}
