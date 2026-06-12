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
});
