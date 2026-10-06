import {TestBed} from '@angular/core/testing';

import {ServiceHealth, ServiceHealthFilterComponent, ServiceHealthFilterParams} from './service-health-filter.component';

describe('ServiceHealthFilterComponent', () => {
  const options: ServiceHealthFilterParams['options'] = [
    {id: 'all', label: 'Tots'},
    {id: 'failing', label: 'Amb errors'},
    {id: 'healthy', label: 'Operatius'},
    {id: 'unchecked', label: 'Sense comprovació'},
  ];

  function render(initial: ServiceHealth | null) {
    let health = initial;
    const params = {
      options,
      health: () => health,
      onHealth: jest.fn((value: ServiceHealth | null) => { health = value; }),
      filterChangedCallback: jest.fn(),
    } as unknown as ServiceHealthFilterParams;
    const fixture = TestBed.createComponent(ServiceHealthFilterComponent);
    fixture.componentInstance.agInit(params);
    fixture.detectChanges();
    return {fixture, params};
  }

  beforeEach(() => TestBed.configureTestingModule({imports: [ServiceHealthFilterComponent]}));

  it('preselects the health given by the query param and reports it active', () => {
    const {fixture} = render('failing');
    const radios = Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
    expect(radios.map((radio) => radio.checked)).toEqual([false, true, false, false]);
    expect(fixture.nativeElement.textContent).toContain('Sense comprovació');
    expect(fixture.componentInstance.isFilterActive()).toBe(true);
    expect(fixture.componentInstance.getModel()).toEqual({value: 'failing'});
  });

  it('reports the choice and asks the grid to reload', () => {
    const {fixture, params} = render(null);
    expect(fixture.componentInstance.isFilterActive()).toBe(false);
    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    radios[1].click();
    expect(params.onHealth).toHaveBeenCalledWith('failing');
    expect(params.filterChangedCallback).toHaveBeenCalled();
    expect(fixture.componentInstance.isFilterActive()).toBe(true);

    radios[0].click();
    expect(params.onHealth).toHaveBeenLastCalledWith(null);
    expect(fixture.componentInstance.getModel()).toBeNull();
  });
});
