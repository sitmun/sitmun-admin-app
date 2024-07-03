import { ExternalConfiguration , ExternalConfigurationHandlerInterface } from './frontend-core/src/lib/public_api';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment } from '../environments/environment';

/** REST API access configuration service*/
@Injectable()
export class ExternalConfigurationService implements ExternalConfigurationHandlerInterface {
  /** deperecated*/
  deserialize() {
    throw new Error('Method not implemented.');
  }

  /** deperecated*/
  serialize() {
    throw new Error('Method not implemented.');
  }

  /** get proxy uri*/
  getProxyUri(): string {
    // TODO: ProxyURI and RootURI will be needing different parameters in environment
    return environment.apiBaseURL + `/api/`
  }

  /** get REST API root uri*/
  getRootUri(): string {
    return environment.apiBaseURL + `/api/`
  }

  /** get HttpClient*/
  getHttp(): HttpClient {
    return this.http;
  }

  /** Constructor*/
  constructor(private http: HttpClient) {
  }

  /**deprecated*/
  getExternalConfiguration(): ExternalConfiguration {
    return null;
  }

  /**deprecated*/
  setExternalConfiguration(externalConfiguration: ExternalConfiguration) {
  }
}
