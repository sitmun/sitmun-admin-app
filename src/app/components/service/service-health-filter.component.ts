import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';

import {IFilterAngularComp} from '@ag-grid-community/angular';
import {IFilterParams} from '@ag-grid-community/core';

export type ServiceHealth = 'failing' | 'healthy' | 'unchecked';

export interface ServiceHealthFilterParams extends IFilterParams {
  health: () => ServiceHealth | null;
  onHealth: (value: ServiceHealth | null) => void;
  options: Array<{id: 'all' | ServiceHealth; label: string}>;
}

let nextGroup = 0;

@Component({
  selector: 'app-service-health-filter',
  standalone: true,
  template: `
    <div class="service-health-filter" role="radiogroup">
      <label *ngFor="let option of options">
        <input type="radio"
               [name]="group"
               [value]="option.id"
               [checked]="selected === option.id"
               (change)="choose(option.id)">
        {{ option.label }}
      </label>
    </div>
  `,
  styles: [`
    .service-health-filter {
      display: flex;
      flex-direction: column;
      min-width: 180px;
      padding: 8px 0;
      font-size: 13px;
    }
    label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      cursor: pointer;
    }
    input {
      accent-color: #ff9800;
    }
  `],
  imports: [CommonModule],
})
export class ServiceHealthFilterComponent implements IFilterAngularComp {
  readonly group = `service-health-filter-${nextGroup++}`;
  options: ServiceHealthFilterParams['options'] = [];
  selected: 'all' | ServiceHealth = 'all';
  private params: ServiceHealthFilterParams;

  agInit(params: ServiceHealthFilterParams): void {
    this.params = params;
    this.options = params.options ?? [];
    this.selected = params.health() ?? 'all';
  }

  isFilterActive(): boolean {
    return this.selected !== 'all';
  }

  doesFilterPass(): boolean {
    return true;
  }

  getModel(): {value: ServiceHealth} | null {
    return this.selected === 'all' ? null : {value: this.selected};
  }

  setModel(model: {value: ServiceHealth} | null): void {
    this.selected = model?.value ?? 'all';
  }

  choose(id: 'all' | ServiceHealth): void {
    this.selected = id;
    this.params.onHealth(id === 'all' ? null : id);
    this.params.filterChangedCallback();
  }
}
