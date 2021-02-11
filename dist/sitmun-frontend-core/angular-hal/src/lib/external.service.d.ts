import { HttpClient } from '@angular/common/http';
import { ExternalConfigurationHandlerInterface } from './external-configuration.handler';
import { ExternalConfiguration } from './ExternalConfiguration';
/** ExternalService */
export declare class ExternalService {
    private externalConfigurationService;
    /** constructor */
    constructor(externalConfigurationService: ExternalConfigurationHandlerInterface);
    /** update ExternalConfigurationHandler */
    updateExternalConfigurationHandlerInterface(externalConfigurationService: ExternalConfigurationHandlerInterface): void;
    /** get ExternalConfiguration */
    getExternalConfiguration(): ExternalConfiguration;
    /** get proxy URL */
    getProxyUri(): string;
    /** get Root URI */
    getRootUri(): string;
    /** get URL */
    getURL(): string;
    /** get HttpClient */
    getHttp(): HttpClient;
}
