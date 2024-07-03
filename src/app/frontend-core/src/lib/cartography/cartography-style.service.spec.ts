import { TestBed, inject } from '@angular/core/testing';

import { CartographyStyleService } from './cartography-style.service';

describe('CartographyStyleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartographyStyleService]
    });
  });

  it('should be created', inject([CartographyStyleService], (service: CartographyStyleService) => {
    expect(service).toBeTruthy();
  }));
});
