import { HttpClient } from '@angular/common/http';

/** External configuration data model */
export class ExternalConfiguration {
    /** root URI */
    public rootUrl: string;
    /** proxy URI */
    public proxyUrl: string;
}

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