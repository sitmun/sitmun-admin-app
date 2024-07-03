import { TestBed, inject } from '@angular/core/testing';

import { CartographyParameterService } from './cartography-parameter.service';

describe('CartographyParameterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartographyParameterService]
    });
  });

  it('should be created', inject([CartographyParameterService], (cartography: CartographyParameterService) => {
    expect(cartography).toBeTruthy();
  }));
});
