import { TestBed, inject } from '@angular/core/testing';

import { CartographyFilterService } from './cartography-filter.service';

describe('CartographyAvailabilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartographyFilterService]
    });
  });

  it('should be created', inject([CartographyFilterService], (filter: CartographyFilterService) => {
    expect(filter).toBeTruthy();
  }));
});
