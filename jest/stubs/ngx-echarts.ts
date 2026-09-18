import {Directive, Input, NgModule} from '@angular/core';
import type {ModuleWithProviders} from '@angular/core';

@Directive({
  selector: '[echarts]',
  standalone: false,
  host: {class: 'echarts-stub'}
})
export class NgxEchartsDirective {
  @Input() options: unknown;
  @Input() loading: unknown;
}

@NgModule({declarations: [NgxEchartsDirective], exports: [NgxEchartsDirective]})
export class NgxEchartsModule {
  static forRoot(_config?: unknown): ModuleWithProviders<NgxEchartsModule> {
    return {ngModule: NgxEchartsModule};
  }
}
