import { TestBed } from '@angular/core/testing';

import { normalizeHandlebarsMarkup, TemplateEditorComponent } from './template-editor.component';

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateEditorComponent],
    });

    component = new TemplateEditorComponent();
    component.html = '<p>Hello</p>';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should strip html tags from inside Handlebars placeholders', () => {
    expect(
      normalizeHandlebarsMarkup(
        '<p><strong>hola</strong> {{task_32281.<span style="color:red">geometryType</span>}}</p>',
      ),
    ).toBe('<p><strong>hola</strong> {{task_32281.geometryType}}</p>');
  });
});
