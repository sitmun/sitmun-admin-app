import { TestBed, inject } from '@angular/core/testing';

import { TerritoryGroupTypeService } from './territory-group-type.service';

describe('.\projects\sitmunFrontendCore\src\lib\territory\territoryGroupTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerritoryGroupTypeService]
    });
  });

  it('should be created', inject([TerritoryGroupTypeService], (service: TerritoryGroupTypeService) => {
    expect(service).toBeTruthy();
  }));
});
