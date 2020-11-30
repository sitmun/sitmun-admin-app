import { TestBed } from '@angular/core/testing';

import { IconsService } from './icons.service.service';

describe('IconsService', () => {
  let service: IconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
