import { Editor } from '@tiptap/core';

import { handlebarsSystemVariableHtmlAttribute } from './handlebars-system-variable.extension';
import { createTemplateEditorExtensions } from './template-editor-extensions';
import {
  editorHtmlHasUnprotectedMustaches,
  normalizeEditorColorValue,
  normalizeHandlebarsMarkup,
  protectHandlebarsExpressions,
  protectStructuralHandlebarsBlocks,
  protectSystemVariableMustaches,
  protectTableHandlebarsBlocks,
  protectTemplateEditorHtml,
  readMustache,
  restoreHandlebarsChipsFromHtml,
  TemplateEditorComponent,
} from './template-editor.component';
import { TemplateHtmlValidatorService } from './template-html-validator.service';

const createSpyObj = (methods: string[]): Record<string, jest.Mock> =>
  methods.reduce((acc, methodName) => {
    acc[methodName] = jest.fn();
    return acc;
  }, {} as Record<string, jest.Mock>);

describe('TemplateEditorComponent', () => {
  let component: TemplateEditorComponent;
  let translateService: Record<string, jest.Mock>;

  beforeEach(() => {
    translateService = createSpyObj(['instant']);
    const validator = new TemplateHtmlValidatorService(translateService as any);
    component = new TemplateEditorComponent(validator, translateService as any, { detectChanges: jest.fn() } as any);
    component.html = '<p>Hello</p>';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should strip html tags from inside Handlebars placeholders', () => {
    expect(normalizeHandlebarsMarkup('<p>{{task.<span>name</span>}}</p>')).toBe('<p>{{task.name}}</p>');
  });

  it('should normalize rgb colors for color inputs', () => {
    expect(normalizeEditorColorValue('rgb(255, 0, 128)', '#000000')).toBe('#ff0080');
  });

  it('should normalize short hex colors for color inputs', () => {
    expect(normalizeEditorColorValue('#0f8', '#000000')).toBe('#00ff88');
  });

  it('should protect structural Handlebars blocks inside tables', () => {
    const protectedHtml = protectTableHandlebarsBlocks('<table><tbody><tr><td>A</td></tr>{{#each AllHits}}<tr><td>{{this.Player}}</td></tr>{{/each}}</tbody></table>');

    expect(protectedHtml).toContain('data-sitmun-handlebars-block="%7B%7B%23each%20AllHits%7D%7D"');
    expect(protectedHtml).toContain('data-sitmun-handlebars-block="%7B%7B%2Feach%7D%7D"');
  });

  it('should protect structural Handlebars blocks outside tables', () => {
    const protectedHtml = protectStructuralHandlebarsBlocks('{{#each AllHits}}<p>{{this.Player}}</p>{{/each}}');

    expect(protectedHtml).toContain('<div data-sitmun-handlebars-block="%7B%7B%23each%20AllHits%7D%7D">{{#each AllHits}}</div>');
    expect(protectedHtml).toContain('<div data-sitmun-handlebars-block="%7B%7B%2Feach%7D%7D">{{/each}}</div>');
    expect(protectedHtml).toContain('<p>{{this.Player}}</p>');
  });

  it('detects unprotected mustaches in visual editor HTML', () => {
    expect(editorHtmlHasUnprotectedMustaches('<p>{{#APP_NAME}}</p>')).toBe(true);
    expect(
      editorHtmlHasUnprotectedMustaches(
        '<p><span data-sitmun-handlebars-sysvar="%7B%7B%23APP_NAME%7D%7D" class="sitmun-handlebars-system-variable-node">{{#APP_NAME}}</span></p>',
      ),
    ).toBe(false);
    expect(
      editorHtmlHasUnprotectedMustaches(
        '<p><span data-sitmun-handlebars-expr="%7B%7Bname%7D%7D">{{name}}</span></p>',
      ),
    ).toBe(false);
  });

  it('should chip system variables separately from structural blocks', () => {
    const protectedHtml = protectTemplateEditorHtml(
      '<p>{{#APP_NAME}}</p>{{#each AllHits}}<p>{{name}}</p>{{/each}}',
    );

    expect(protectedHtml).toContain('sitmun-handlebars-system-variable-node');
    expect(protectedHtml).toContain(`${handlebarsSystemVariableHtmlAttribute}=`);
    expect(protectedHtml).toContain('data-sitmun-handlebars-block=');
    expect(protectedHtml).not.toMatch(/data-sitmun-handlebars-block="[^"]*%23APP_NAME/);
    expect(protectSystemVariableMustaches('{{#USER_ID}}')).toContain(`${handlebarsSystemVariableHtmlAttribute}=`);
  });

  it('should switch to html mode without editor instance', () => {
    component.setEditorMode('html');

    expect(component.editorMode).toBe('html');
  });

  it('should emit preview open state when toggled', () => {
    const emitted: boolean[] = [];
    component.previewOpen = false;
    component.previewOpenChange.subscribe((value) => emitted.push(value));

    component.togglePreview();
    component.previewOpen = true;
    component.togglePreview();

    expect(emitted).toEqual([true, false]);
  });

  it('should delete the table when deleting the last row', () => {
    const deleteRow = jest.fn();
    const deleteTable = jest.fn().mockReturnValue(true);
    (component as any).editor = {
      chain: () => ({
        focus: () => ({
          deleteRow: () => ({ run: deleteRow }),
        }),
      }),
      commands: { deleteTable },
    };
    jest.spyOn(component, 'isTableContextVisible').mockReturnValue(true);
    jest.spyOn(component as any, 'getCurrentTableInfo').mockReturnValue({ rowCount: 1, columnCount: 2 });
    jest.spyOn(component as any, 'getCurrentTablePosition').mockReturnValue(null);
    jest.spyOn(component as any, 'syncSelectionState').mockImplementation(() => undefined);

    component.deleteRow();

    expect(deleteTable).toHaveBeenCalled();
    expect(deleteRow).not.toHaveBeenCalled();
  });

  it('should delete a column when more than one remains', () => {
    const deleteColumnRun = jest.fn();
    (component as any).editor = {
      chain: () => ({
        focus: () => ({
          deleteColumn: () => ({ run: deleteColumnRun }),
        }),
      }),
      commands: { deleteTable: jest.fn() },
    };
    jest.spyOn(component, 'isTableContextVisible').mockReturnValue(true);
    jest.spyOn(component as any, 'getCurrentTableInfo').mockReturnValue({ rowCount: 2, columnCount: 3 });
    jest.spyOn(component as any, 'syncSelectionState').mockImplementation(() => undefined);

    component.deleteColumn();

    expect(deleteColumnRun).toHaveBeenCalled();
  });

  it('should emit valid html changes in source mode', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));

    component.onHtmlSourceChanged('<p>Hello</p><table><tbody><tr><td>{{value}}</td></tr></tbody></table>');

    expect(emitted).toEqual(['<p>Hello</p><table><tbody><tr><td>{{value}}</td></tr></tbody></table>']);
    expect(component.validationErrors).toEqual([]);
  });

  it('should keep invalid html local and report errors', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));

    translateService.instant.mockReturnValue('No se permite la etiqueta <script>.');
    component.onHtmlSourceChanged('<script>alert(1)</script>');

    expect(emitted).toEqual([]);
    expect(component.validationErrors).toContain('No se permite la etiqueta <script>.');
  });

  it('should format valid html in source mode', () => {
    const emitted: string[] = [];
    component.htmlChange.subscribe((value) => emitted.push(value));

    component.onHtmlSourceChanged('<div><p>Hello</p><p>World</p></div>');
    component.formatHtmlSource();

    expect(component.htmlSource).toContain('\n');
    expect(emitted.at(-1)).toBe(component.htmlSource);
  });

  it('should wrap inline mustaches as expression chips without touching structural blocks', () => {
    const protectedHtml = protectTemplateEditorHtml('{{#each AllHits}}<p>{{this.Player}}</p>{{/each}}');

    expect(protectedHtml).toContain('data-sitmun-handlebars-block=');
    expect(protectedHtml).toContain('data-sitmun-handlebars-expr=');
    expect(protectHandlebarsExpressions('{{name}}')).toContain('data-sitmun-handlebars-expr=');
    expect(protectHandlebarsExpressions('{{{html}}}')).toContain('data-sitmun-handlebars-expr=');
  });

  it('leaves attribute mustaches literal for img, anchor, iframe, and sysvar attrs', () => {
    const protectedHtml = protectTemplateEditorHtml(
      '<img src="{{task_1.url}}" alt=\'{{task_1.url}}\'>' +
        '<a href="{{task_1.url}}">x</a>' +
        '<iframe src="{{task_1.contentUrl}}"></iframe>' +
        '<p title="{{#APP_NAME}}" data-app="{{#APP_ID}}">t</p>',
    );

    expect(protectedHtml).toContain('src="{{task_1.url}}"');
    expect(protectedHtml).toContain("alt='{{task_1.url}}'");
    expect(protectedHtml).toContain('href="{{task_1.url}}"');
    expect(protectedHtml).toContain('src="{{task_1.contentUrl}}"');
    expect(protectedHtml).toContain('title="{{#APP_NAME}}"');
    expect(protectedHtml).toContain('data-app="{{#APP_ID}}"');
    expect(protectedHtml).not.toMatch(/src="[^"]*data-sitmun-handlebars/);
    expect(protectedHtml).not.toMatch(/href="[^"]*data-sitmun-handlebars/);
  });

  it('wraps HTML comments as TipTap markers without chipping mustaches inside', () => {
    const protectedHtml = protectTemplateEditorHtml(
      '<!-- tip: {{foto.url}} --><p>{{task_1.url}}</p><p>{{#APP_NAME}}</p>',
    );

    expect(protectedHtml).toContain('data-sitmun-html-comment=');
    expect(protectedHtml).toContain(encodeURIComponent('<!-- tip: {{foto.url}} -->'));
    expect(protectedHtml).not.toContain('<!-- tip: {{foto.url}} -->');
    expect(protectedHtml).toContain('data-sitmun-handlebars-expr=');
    expect(protectedHtml).toContain('data-sitmun-handlebars-sysvar=');
    expect(protectedHtml).not.toMatch(/data-sitmun-html-comment="[^"]*data-sitmun-handlebars/);
  });

  it('chips else and else-if as structural blocks', () => {
    const protectedHtml = protectTemplateEditorHtml(
      '{{#if foo}}yes{{else if bar}}maybe{{else}}no{{/if}}',
    );

    expect(protectedHtml).toContain('data-sitmun-handlebars-block="%7B%7B%23if%20foo%7D%7D"');
    expect(protectedHtml).toContain('data-sitmun-handlebars-block="%7B%7Belse%20if%20bar%7D%7D"');
    expect(protectedHtml).toContain('data-sitmun-handlebars-block="%7B%7Belse%7D%7D"');
    expect(protectedHtml).toContain('data-sitmun-handlebars-block="%7B%7B%2Fif%7D%7D"');
  });

  it('is idempotent for text chips and attribute mustaches', () => {
    const html =
      '<img src="{{task_1.url}}"><p>{{name}}</p>{{#if x}}{{else if y}}{{else}}{{/if}}<!-- {{c}} -->';
    const once = protectTemplateEditorHtml(html);
    expect(protectTemplateEditorHtml(once)).toBe(once);
  });

  it('treats attribute-only and comment mustaches as already protected', () => {
    expect(editorHtmlHasUnprotectedMustaches('<img src="{{task_1.url}}">')).toBe(false);
    expect(editorHtmlHasUnprotectedMustaches('<!-- {{name}} --><p>x</p>')).toBe(false);
    expect(editorHtmlHasUnprotectedMustaches('<p>{{name}}</p>')).toBe(true);
  });

  it('reads mustaches that contain quoted closing braces', () => {
    const source = '{{#if (eq x "}")}}yes{{/if}}';
    const first = readMustache(source, 0);
    expect(first?.value).toBe('{{#if (eq x "}")}}');
  });

  it('restores chips for T-wrap payloads', () => {
    const chipped = protectTemplateEditorHtml('<span>{{name}}</span>');
    expect(chipped).toContain('data-sitmun-handlebars-expr');
    expect(restoreHandlebarsChipsFromHtml(chipped)).toContain('{{name}}');
    expect(restoreHandlebarsChipsFromHtml(chipped)).not.toContain('data-sitmun-handlebars-expr');
  });

  it('keeps attribute mustaches through TipTap setContent/getHTML', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const editor = new Editor({
      element: host,
      extensions: createTemplateEditorExtensions(),
      content: '',
    });

    editor.commands.setContent(
      protectTemplateEditorHtml('<img src="{{task_1.url}}" alt="{{task_1.url}}"><p>{{name}}</p>'),
      false,
    );
    const html = editor.getHTML();
    expect(html).toContain('src="{{task_1.url}}"');
    expect(html).toContain('alt="{{task_1.url}}"');
    expect(html).not.toMatch(/src="[^"]*data-sitmun-handlebars/);
    expect(html).toContain('data-sitmun-handlebars-expr');

    editor.destroy();
    host.remove();
  });

  it('preserves HTML comments through TipTap setContent/getHTML restore', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const editor = new Editor({
      element: host,
      extensions: createTemplateEditorExtensions(),
      content: '',
    });

    const source =
      '<h1>t</h1><!-- tip: {{foto.url}} must stay --><section><p>x</p></section>';
    editor.commands.setContent(protectTemplateEditorHtml(source), false);
    expect(editor.getHTML()).toContain('data-sitmun-html-comment=');
    expect(editor.getHTML()).not.toContain('<!-- tip:');

    const serialized = restoreHandlebarsChipsFromHtml(editor.getHTML());
    expect(serialized).toContain('<!-- tip: {{foto.url}} must stay -->');
    expect(serialized).not.toContain('data-sitmun-html-comment');

    editor.destroy();
    host.remove();
  });

  it('round-trips inline mustache chips to raw mustaches through TipTap', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const editor = new Editor({
      element: host,
      extensions: createTemplateEditorExtensions(),
      content: '',
    });

    editor.commands.setContent(protectTemplateEditorHtml('<p>{{name}}</p><p>{{{html}}}</p>'), false);
    expect(editor.getHTML()).toContain('data-sitmun-handlebars-expr');

    const serialized = restoreHandlebarsChipsFromHtml(editor.getHTML());
    expect(serialized).toContain('{{name}}');
    expect(serialized).toContain('{{{html}}}');
    expect(serialized).not.toContain('data-sitmun-handlebars-expr');

    editor.destroy();
    host.remove();
  });

  it('round-trips system-variable chips separately from each-blocks through TipTap', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const editor = new Editor({
      element: host,
      extensions: createTemplateEditorExtensions(),
      content: '',
    });

    editor.commands.setContent(
      protectTemplateEditorHtml('<p>{{#APP_NAME}}</p>{{#each rows}}<p>{{x}}</p>{{/each}}'),
      false,
    );
    expect(editor.getHTML()).toContain('data-sitmun-handlebars-sysvar');
    expect(editor.getHTML()).toContain('data-sitmun-handlebars-block');
    expect(editor.getHTML()).not.toMatch(/data-sitmun-handlebars-block="[^"]*APP_NAME/);

    const serialized = restoreHandlebarsChipsFromHtml(editor.getHTML());
    expect(serialized).toContain('{{#APP_NAME}}');
    expect(serialized).toContain('{{#each rows}}');
    expect(serialized).toContain('{{/each}}');
    expect(serialized).not.toContain('data-sitmun-handlebars-sysvar');

    editor.destroy();
    host.remove();
  });

  describe('edited-document shape preservation (PR2)', () => {
    function serializeVisual(html: string): string {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const editor = new Editor({
        element: host,
        extensions: createTemplateEditorExtensions(),
        content: '',
      });
      editor.commands.setContent(protectTemplateEditorHtml(html), false);
      // Insert a sibling paragraph at the document end (outside tables/blocks).
      editor.commands.insertContentAt(editor.state.doc.content.size, {
        type: 'paragraph',
        content: [{ type: 'text', text: 'sibling-marker' }],
      });
      (component as any).editor = editor;
      const serialized = (component as any).serializeEditorHtml() as string;
      editor.destroy();
      host.remove();
      (component as any).editor = null;
      return serialized;
    }

    it('keeps authored div blocks after a sibling visual edit', () => {
      const serialized = serializeVisual('<div class="box"><p>inside</p></div>');
      expect(serialized).toContain('<div');
      expect(serialized).toContain('class="box"');
      expect(serialized).toContain('inside');
      expect(serialized).toContain('sibling-marker');
      expect(serialized).not.toMatch(/^<p class="box"/);
    });

    it('does not inject colgroup or min-width into a minimal authored table', () => {
      const serialized = serializeVisual(
        '<table><tbody><tr><td>A</td><td>B</td></tr></tbody></table>',
      );
      expect(serialized).toContain('<table');
      expect(serialized).toContain('<td>A</td>');
      expect(serialized).toContain('<td>B</td>');
      expect(serialized).not.toContain('<colgroup');
      expect(serialized).not.toContain('min-width');
      expect(serialized).not.toContain('data-sitmun-had-colgroup');
      expect(serialized).not.toContain('data-sitmun-cell-bare');
    });

    it('does not force target/rel onto authored links without them', () => {
      const serialized = serializeVisual('<p><a href="https://example.test/x">link</a></p>');
      expect(serialized).toContain('href="https://example.test/x"');
      expect(serialized).not.toContain('target=');
      expect(serialized).not.toContain('rel=');
    });

    it('sets target and rel when the toolbar creates a link', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const editor = new Editor({
        element: host,
        extensions: createTemplateEditorExtensions(),
        content: '<p>hello</p>',
      });
      editor.commands.setTextSelection({ from: 1, to: 6 });
      editor.chain().focus().setLink({
        href: 'https://example.test/new',
        target: '_blank',
        rel: 'noopener noreferrer',
      }).run();
      const html = editor.getHTML();
      expect(html).toContain('href="https://example.test/new"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
      editor.destroy();
      host.remove();
    });
  });
});
