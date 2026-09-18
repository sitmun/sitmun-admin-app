import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { firstValueFrom, toArray } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';

import { CapabilitiesService } from './capabilities.service';

describe('CapabilitiesService', () => {
  let service: CapabilitiesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CapabilitiesService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    });

    service = TestBed.inject(CapabilitiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInfo', () => {
    it('should return of(null) observable when url is empty string', async () => {
      const result = service.getInfo({ url: '', type: 'WMS' });
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([null]);
    });

    it('should return of(null) observable when probe is null', async () => {
      const result = service.getInfo(null);
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([null]);
    });

    it('should return of(null) observable when type is missing', async () => {
      const result = service.getInfo({ url: 'https://example.com/wms' } as never);
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([null]);
    });

    it('should emit null then complete when url is missing', (done) => {
      const result = service.getInfo({ url: '', type: 'WMS' });
      let emittedValue: any;
      result.subscribe({
        next: (value) => { emittedValue = value; },
        complete: () => {
          expect(emittedValue).toBeNull();
          done();
        }
      });
    });

    it('POSTs the form URL and type without a url query param', () => {
      const upstream =
        'https://pcivil.icgc.cat/ogc/geoservei?map=/opt/idec/dades/pcivil/risc_quimic.map';

      service.getInfo({ url: upstream, type: 'WMS' }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url.includes('helpers/capabilities')
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.params.get('url')).toBeNull();
      expect(req.request.body).toEqual({ url: upstream, type: 'WMS' });
      req.flush({ success: true });
    });

    it('omits id below 1 and empty password', () => {
      service.getInfo({
        id: -1,
        url: 'https://example.com/wms',
        type: 'WMS',
        authenticationMode: 'HTTP Basic authentication',
        user: 'alice',
        password: '',
      }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url.includes('helpers/capabilities')
      );
      expect(req.request.body).toEqual({
        url: 'https://example.com/wms',
        type: 'WMS',
        authenticationMode: 'HTTP Basic authentication',
        user: 'alice',
      });
      expect(req.request.body).not.toHaveProperty('id');
      expect(req.request.body).not.toHaveProperty('password');
      req.flush({ success: true });
    });

    it('includes saved id and typed password', () => {
      service.getInfo({
        id: 12,
        url: 'https://example.com/wms',
        type: 'WMS',
        authenticationMode: 'HTTP Basic authentication',
        user: 'alice',
        password: 'secret',
      }).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url.includes('helpers/capabilities')
      );
      expect(req.request.body).toEqual({
        id: 12,
        url: 'https://example.com/wms',
        type: 'WMS',
        authenticationMode: 'HTTP Basic authentication',
        user: 'alice',
        password: 'secret',
      });
      req.flush({ success: true });
    });
  });
});
