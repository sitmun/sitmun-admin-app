import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { ExternalService, ResourceService } from '@app/core/hal';

import { AdminRuntimeConfigurationService } from './admin-runtime-configuration.service';
import { AdminConfiguration } from '../models/admin-configuration.model';

const MOCK_RESPONSE: AdminConfiguration = {
  imageUpload: {
    tree: {
      supportedFormats: ['png', 'jpg', 'jpeg'],
      maxBytes: 2097152,
      defaultSize: { width: 125, height: 125 },
      sizesByType: {
        menu: { width: 50, height: 50 },
        list: { width: 350, height: 350 },
      },
    },
  },
};

describe('AdminRuntimeConfigurationService', () => {
  let service: AdminRuntimeConfigurationService;
  let httpTesting: HttpTestingController;
  let resourceService: ResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AdminRuntimeConfigurationService,
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
      ],
    });

    service = TestBed.inject(AdminRuntimeConfigurationService);
    httpTesting = TestBed.inject(HttpTestingController);
    resourceService = TestBed.inject(ResourceService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('calls GET config/admin via ResourceService URL', async () => {
    const expectedUrl = resourceService.getResourceUrl('config/admin');
    const promise = firstValueFrom(service.getTreeImageUploadConfiguration());

    const req = httpTesting.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_RESPONSE);
    await promise;
  });

  it('emits tree image upload configuration from backend response', async () => {
    const expectedUrl = resourceService.getResourceUrl('config/admin');
    const promise = firstValueFrom(service.getTreeImageUploadConfiguration());

    httpTesting.expectOne(expectedUrl).flush(MOCK_RESPONSE);
    const result = await promise;

    expect(result.defaultSize).toEqual({ width: 125, height: 125 });
    expect(result.sizesByType['menu']).toEqual({ width: 50, height: 50 });
    expect(result.sizesByType['list']).toEqual({ width: 350, height: 350 });
    expect(result.maxBytes).toBe(2097152);
  });

  it('shares the same request across multiple subscribers', async () => {
    const expectedUrl = resourceService.getResourceUrl('config/admin');

    const p1 = firstValueFrom(service.getTreeImageUploadConfiguration());
    const p2 = firstValueFrom(service.getTreeImageUploadConfiguration());

    // Only one HTTP request should be made
    const requests = httpTesting.match(expectedUrl);
    expect(requests.length).toBe(1);
    requests[0].flush(MOCK_RESPONSE);

    await Promise.all([p1, p2]);
  });

});
