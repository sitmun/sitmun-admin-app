import { HttpClient } from '@angular/common/http';
import { ExternalConfigurationHandlerInterface } from './external-configuration.handler';
import { ExternalConfiguration } from './ExternalConfiguration';
/** ExternalService */
import * as ɵngcc0 from '@angular/core';
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
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ExternalService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ExternalService>;
}

//# sourceMappingURL=external.service.d.ts.map