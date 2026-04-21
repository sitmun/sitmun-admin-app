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

  it('should allow switching to html source mode', () => {
    expect(component.editorMode).toBe('visual');

    component.setEditorMode('html');

    expect(component.editorMode).toBe('html');
    expect(component.htmlSource).toBe('<p>Hello</p>');
  });

  it('should emit raw html edits in source mode', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));
    component.setEditorMode('html');

    component.onHtmlSourceChanged('<p>Hello</p><iframe src="https://example.com"></iframe>');

    expect(component.htmlSource).toContain('<iframe');
    expect(emitted).toEqual(['<p>Hello</p><iframe src="https://example.com"></iframe>']);
  });
});
