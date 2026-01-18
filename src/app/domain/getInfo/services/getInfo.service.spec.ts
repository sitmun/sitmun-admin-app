import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { firstValueFrom, toArray } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';

import { GetInfoService } from './getInfo.service';

describe('GetInfoService', () => {
  let service: GetInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetInfoService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService }
      ]
    });

    service = TestBed.inject(GetInfoService);
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
  });
});
