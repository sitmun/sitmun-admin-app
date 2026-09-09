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
      const result = service.getInfo('');
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([null]);
    });

    it('should return of(null) observable when url is null', async () => {
      const result = service.getInfo(null as any);
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([null]);
    });

    it('should return of(null) observable when url is undefined', async () => {
      const result = service.getInfo(undefined as any);
      const values = await firstValueFrom(result.pipe(toArray()));
      expect(values).toEqual([null]);
    });

    it('should emit null then complete when url is missing', (done) => {
      const result = service.getInfo('');
      let emittedValue: any;
      result.subscribe({
        next: (value) => { emittedValue = value; },
        complete: () => {
          expect(emittedValue).toBeNull();
          done();
        }
      });
    });

    it('sends the full upstream URL as a single url query param', () => {
      const upstream =
        'https://pcivil.icgc.cat/ogc/geoservei?map=/opt/idec/dades/pcivil/risc_quimic.map&request=GetCapabilities&service=WMS';

      service.getInfo(upstream).subscribe();

      const req = httpMock.expectOne(
        (request) => request.url.includes('helpers/capabilities')
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('url')).toBe(upstream);
      req.flush({ success: true });
    });
  });
});
