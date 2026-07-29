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

    const doc = new DOMParser().parseFromString(editor.getHTML(), 'text/html');
    for (const node of Array.from(doc.body.querySelectorAll('span[data-sitmun-handlebars-expr]'))) {
      node.replaceWith(document.createTextNode(decodeURIComponent(node.getAttribute('data-sitmun-handlebars-expr') || '')));
    }
    const serialized = doc.body.innerHTML;
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

    const doc = new DOMParser().parseFromString(editor.getHTML(), 'text/html');
    for (const node of Array.from(doc.body.querySelectorAll('span[data-sitmun-handlebars-sysvar]'))) {
      node.replaceWith(
        document.createTextNode(decodeURIComponent(node.getAttribute('data-sitmun-handlebars-sysvar') || '')),
      );
    }
    for (const node of Array.from(doc.body.querySelectorAll('div[data-sitmun-handlebars-block]'))) {
      node.replaceWith(
        document.createTextNode(decodeURIComponent(node.getAttribute('data-sitmun-handlebars-block') || '')),
      );
    }
    for (const node of Array.from(doc.body.querySelectorAll('span[data-sitmun-handlebars-expr]'))) {
      node.replaceWith(
        document.createTextNode(decodeURIComponent(node.getAttribute('data-sitmun-handlebars-expr') || '')),
      );
    }

    const serialized = doc.body.innerHTML;
    expect(serialized).toContain('{{#APP_NAME}}');
    expect(serialized).toContain('{{#each rows}}');
    expect(serialized).toContain('{{/each}}');
    expect(serialized).not.toContain('data-sitmun-handlebars-sysvar');

    editor.destroy();
    host.remove();
  });
});
