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

  it('should not merge paragraphs when a typed Handlebars opener reaches a later closer', () => {
    const html = '<p>1-hola</p><p>{{</p><p>2-que tal</p><p>}}</p>';

    expect(normalizeHandlebarsMarkup(html)).toBe(html);
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

  it('should not emit duplicated html source changes when content is unchanged', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));
    component.setEditorMode('html');

    component.onHtmlSourceChanged('<p>Hello</p>');

    expect(emitted).toEqual([]);
  });

  it('should serialize the editor DOM html to preserve table resize metadata', () => {
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      getSemanticHTML: () => '<table><tbody><tr><td>Clean</td></tr></tbody></table>',
      root: {
        innerHTML: '<table class="ql-table-better" style="width: 640px"><colgroup><col style="width: 240px"></colgroup><tbody><tr><td>Styled</td></tr></tbody></table>',
      },
    };

    expect((component as any).getEditorHtml())
      .toBe('<table class="ql-table-better" style="width: 640px"><colgroup><col style="width: 240px"></colgroup><tbody><tr><td>Styled</td></tr></tbody></table>');
  });

  it('should sync live editor DOM when switching to html source mode', () => {
    component.htmlSource = '<p>Old</p>';
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      root: {
        innerHTML: '<table class="ql-table-better"><colgroup><col width="260"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>',
      },
    };

    component.setEditorMode('html');

    expect(component.htmlSource)
      .toBe('<table class="ql-table-better"><colgroup><col width="260"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>');
  });

  it('should emit live editor DOM changes that do not trigger Quill text-change', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));
    component.htmlSource = '<p>Old</p>';
    (component as any).quill = {
      getModule: () => ({ hideTools: jest.fn() }),
      root: {
        innerHTML: '<table class="ql-table-better"><colgroup><col width="300"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>',
      },
    };

    (component as any).syncHtmlSourceFromEditorDom();

    expect(emitted).toEqual([
      '<table class="ql-table-better"><colgroup><col width="300"></colgroup><tbody><tr><td>Resized</td></tr></tbody></table>',
    ]);
  });
});
