import { ExternalConfiguration } from './external-configuration.model';
import { HttpClient } from '@angular/common/http';

/** External configuration handler interface */
export interface ExternalConfigurationHandlerInterface {
    /** get external configuration */
    getExternalConfiguration(): ExternalConfiguration;
    
    /** get proxy URL */
    getProxyUri(): string;
    /** get proxy URI */
    getRootUri(): string;
    /** get HttpClient */
    getHttp(): HttpClient;

    /** set ExternalConfiguration */
    setExternalConfiguration(externalConfiguration: ExternalConfiguration);
}
