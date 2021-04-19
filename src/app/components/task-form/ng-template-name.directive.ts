import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[name]'
})
export class NgTemplateNameDirective {
  @Input() name: string;
  
  constructor(public template: TemplateRef<any>) { }
}
