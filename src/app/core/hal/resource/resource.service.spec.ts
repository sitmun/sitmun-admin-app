import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ExternalConfigurationService } from '@app/core/config/external-configuration.service';
import { LoggerService } from '@app/services/logger.service';

import { Resource } from './resource.model';
import { ResourceService } from './resource.service';
import { ExternalService } from '../config/external.service';

class TestResource extends Resource {}

class TestRelatedResource extends Resource {}

describe('ResourceService authenticated HAL requests', () => {
  let resourceService: ResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ResourceService,
        ExternalService,
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        {
          provide: LoggerService,
          useValue: {
            trace: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    });

    resourceService = TestBed.inject(ResourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send credentials when fetching a resource by id', () => {
    resourceService.get(TestResource, 'backgrounds', 8).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/backgrounds/8') &&
      request.params.get('projection') === 'view'
    );
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: 8, name: 'Background 8' });
  });

  it('should send credentials when fetching a resource collection', () => {
    resourceService.fetch(TestResource, 'backgrounds', 'backgrounds').subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/backgrounds') &&
      request.params.get('projection') === 'view'
    );
    expect(req.request.withCredentials).toBe(true);
    req.flush({ _embedded: { backgrounds: [] } });
  });
});

describe('Resource relation requests', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: 'ExternalConfigurationService', useClass: ExternalConfigurationService },
        ExternalService,
      ],
    });

    TestBed.inject(ExternalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send credentials when following a templated relation link', () => {
    const resource = new TestResource();
    resource._links = {
      applications: {
        href: 'http://localhost:9000/backend/api/backgrounds/8/applications{?projection}',
      },
    };

    resource.getRelationArrayEx(TestRelatedResource, 'applications', { projection: 'view' }).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url.includes('/api/backgrounds/8/applications') &&
      request.url.includes('projection=view')
    );
    expect(req.request.withCredentials).toBe(true);
    req.flush({ _embedded: { _embedded: [] } });
  });
});
