import { TemplateHtmlValidatorService } from './template-html-validator.service';

const createSpyObj = (methods: string[]): Record<string, jest.Mock> =>
  methods.reduce((acc, methodName) => {
    acc[methodName] = jest.fn();
    return acc;
  }, {} as Record<string, jest.Mock>);

describe('TemplateHtmlValidatorService', () => {
  let service: TemplateHtmlValidatorService;
  let translateService: Record<string, jest.Mock>;

  beforeEach(() => {
    translateService = createSpyObj(['instant']);
    service = new TemplateHtmlValidatorService(translateService as any);
  });

  it('accepts valid template html with handlebars and translation tags', () => {
    expect(service.validate('<p>Hola {{user.name}}</p><t><strong>Bon dia</strong></t>').valid).toBe(true);
  });

  it('warns when inline CSS is not guaranteed in PDF export', () => {
    translateService.instant.mockImplementation((key: string, params?: any) =>
      key === 'entity.task.template.editor.validation.unsupportedCss'
        ? `${params.property}: ${params.value}`
        : key,
    );

    const result = service.validate(
      '<div style="display: flex; gap: 12px; color: red">Content</div>',
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([
      'display: flex',
      'gap: 12px',
    ]);
  });

  it('deduplicates repeated unsupported CSS declarations', () => {
    translateService.instant.mockImplementation((key: string, params?: any) =>
      key === 'entity.task.template.editor.validation.unsupportedCss'
        ? `${params.property}: ${params.value}`
        : key,
    );

    const result = service.validate(
      '<div style="display:grid"><span style="display: grid">One</span></div>',
    );

    expect(result.warnings).toEqual(['display: grid']);
  });

  it('does not warn for regular PDF-safe inline CSS', () => {
    const result = service.validate('<p style="color: #123456; margin: 10px">Content</p>');

    expect(result.warnings).toEqual([]);
  });

  it('rejects script tags', () => {
    translateService.instant.mockReturnValue('No se permite la etiqueta <script>.');
    expect(service.validate('<script>alert(1)</script>').errors).toContain('No se permite la etiqueta <script>.');
  });

  it('rejects style tags', () => {
    translateService.instant.mockReturnValue('No se permite la etiqueta <style>; usa estilos inline.');
    expect(service.validate('<style>p{color:red}</style>').errors).toContain('No se permite la etiqueta <style>; usa estilos inline.');
  });

  it('rejects javascript event attributes', () => {
    translateService.instant.mockImplementation((key: string, params?: any) => {
      if (key === 'entity.task.template.editor.validation.javaScriptAttribute') {
        return `No se permiten atributos JavaScript: ${params.attribute}.`;
      }
      return key;
    });
    expect(service.validate('<p onclick="x()">Hola</p>').errors).toContain('No se permiten atributos JavaScript: onclick.');
  });

  it('rejects javascript urls', () => {
    translateService.instant.mockReturnValue('No se permiten URLs javascript:.');
    expect(service.validate('<a href="javascript:alert(1)">x</a>').errors).toContain('No se permiten URLs javascript:.');
  });

  it('rejects nested translation tags', () => {
    translateService.instant.mockReturnValue('No se permite anidar etiquetas <t>.');
    expect(service.validate('<t>Hola <t>Mundo</t></t>').errors).toContain('No se permite anidar etiquetas <t>.');
  });

  it('rejects unbalanced translation tags', () => {
    translateService.instant.mockImplementation((key: string) => {
      if (key === 'entity.task.template.editor.validation.unclosedT') {
        return 'Etiqueta <t> sin cierre.';
      }
      return key;
    });
    expect(service.validate('<t>Hola').errors).toContain('Etiqueta <t> sin cierre.');
  });

  it('still allows visual mode when a comment is unclosed but later tags balance', () => {
    expect(service.validate('<p>BEFORE_MARKER</p><!-- tip <p>AFTER_MARKER</p>').valid).toBe(true);
    expect(service.validate('<p>BEFORE_MARKER</p><!-- tip -><p>AFTER_MARKER</p>').valid).toBe(true);
    expect(service.validate('<p>BEFORE_MARKER</p><!-- tip -- ><p>AFTER_MARKER</p>').valid).toBe(true);
  });

  it('accepts one top-level PDF header and footer', () => {
    expect(service.validate(
      '<table class="sitmun-pdf-header"><tbody><tr><td>Header</td></tr></tbody></table><p class="sitmun-pdf-footer">Footer</p>',
    ).valid).toBe(true);
  });

  it('accepts full-bleed PDF header and footer variants', () => {
    expect(service.validate(
      '<table class="sitmun-pdf-header-full-bleed"><tbody><tr><td>Header</td></tr></tbody></table>'
      + '<p class="sitmun-pdf-footer-full-bleed">Footer</p>',
    ).valid).toBe(true);
  });

  it('rejects duplicate PDF regions', () => {
    translateService.instant.mockImplementation((key: string) => key);
    const result = service.validate('<p class="sitmun-pdf-header">One</p><p class="sitmun-pdf-header">Two</p>');

    expect(result.errors).toContain('entity.task.template.editor.validation.multiplePdfHeaders');
  });

  it('rejects different variants of the same PDF region', () => {
    translateService.instant.mockImplementation((key: string) => key);
    const result = service.validate(
      '<p class="sitmun-pdf-header">One</p><p class="sitmun-pdf-header-full-bleed">Two</p>',
    );

    expect(result.errors).toContain('entity.task.template.editor.validation.multiplePdfHeaders');
  });

  it('rejects a block marked as both PDF header and footer', () => {
    translateService.instant.mockImplementation((key: string) => key);
    const result = service.validate('<p class="sitmun-pdf-header sitmun-pdf-footer">Both</p>');

    expect(result.errors).toContain('entity.task.template.editor.validation.conflictingPdfRegion');
  });

  it('accepts a PDF header nested in template content', () => {
    const result = service.validate(
      '<table><tbody><tr><td><table class="sitmun-pdf-header"><tbody><tr><td>Header</td></tr></tbody></table></td></tr></tbody></table>',
    );

    expect(result.valid).toBe(true);
  });

  it('rejects PDF regions nested within each other', () => {
    translateService.instant.mockImplementation((key: string) => key);
    const result = service.validate(
      '<table class="sitmun-pdf-header"><tbody><tr><td><p class="sitmun-pdf-footer">Footer</p></td></tr></tbody></table>',
    );

    expect(result.errors).toContain('entity.task.template.editor.validation.invalidPdfRegionBlock');
  });

  it('rejects iframe elements marked as PDF regions', () => {
    translateService.instant.mockImplementation((key: string) => key);

    const result = service.validate(
      '<iframe class="sitmun-pdf-header" src="https://example.org/document.pdf"></iframe>',
    );

    expect(result.errors).toContain('entity.task.template.editor.validation.invalidPdfRegionBlock');
  });
});
