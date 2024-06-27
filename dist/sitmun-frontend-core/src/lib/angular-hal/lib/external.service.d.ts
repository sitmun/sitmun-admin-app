import { HttpClient } from '@angular/common/http';
import { ExternalConfigurationHandlerInterface } from './external-configuration.handler';
import { ExternalConfiguration } from './ExternalConfiguration';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDef<ExternalService, never>;
    static ɵprov: i0.ɵɵInjectableDef<ExternalService>;
}
