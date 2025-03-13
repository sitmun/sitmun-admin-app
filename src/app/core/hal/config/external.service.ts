import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceHelper } from '../resource/resource-helper';
import { ExternalConfigurationHandlerInterface } from './external-configuration-handler.interface';
import { ExternalConfiguration } from './external-configuration.model';

/** ExternalService */
@Injectable()
export class ExternalService {

    /** constructor */
    constructor(@Inject('ExternalConfigurationService') private externalConfigurationService: ExternalConfigurationHandlerInterface) {
        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }

    /** update ExternalConfigurationHandler */
    public updateExternalConfigurationHandlerInterface(externalConfigurationService: ExternalConfigurationHandlerInterface) {
	this.externalConfigurationService = externalConfigurationService;

        ResourceHelper.setProxyUri(externalConfigurationService.getProxyUri());
        ResourceHelper.setRootUri(externalConfigurationService.getRootUri());
        ResourceHelper.setHttp(externalConfigurationService.getHttp());
    }

    /** get ExternalConfiguration */
    public getExternalConfiguration(): ExternalConfiguration {
        return this.externalConfigurationService.getExternalConfiguration();
    }

    /** get proxy URL */
    public getProxyUri(): string {
        return this.externalConfigurationService.getProxyUri();
    }

    /** get Root URI */
    public getRootUri(): string {
        return this.externalConfigurationService.getRootUri();
    }

    /** get URL */
    public getURL(): string {
        return ResourceHelper.getURL();
    }

    /** get HttpClient */
    public getHttp(): HttpClient {
        return ResourceHelper.getHttp();
    }
}
