import { TestBed } from '@angular/core/testing';

import { Icons.ServiceService } from './icons.service.service';

describe('Icons.ServiceService', () => {
  let service: Icons.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Icons.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
