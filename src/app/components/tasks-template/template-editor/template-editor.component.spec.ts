import { normalizeEditorColorValue, normalizeHandlebarsMarkup, protectStructuralHandlebarsBlocks, protectTableHandlebarsBlocks, TemplateEditorComponent } from './template-editor.component';
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

  it('should switch to html mode without editor instance', () => {
    component.setEditorMode('html');

    expect(component.editorMode).toBe('html');
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
});
