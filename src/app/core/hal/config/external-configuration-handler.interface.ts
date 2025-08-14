import { HttpClient } from '@angular/common/http';
import { ExternalConfiguration } from './external-configuration.model';

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
    setExternalConfiguration(externalConfiguration: ExternalConfiguration): void;
} 