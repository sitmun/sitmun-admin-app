import { readFileSync } from 'fs';
import { join } from 'path';

const componentsRoot = __dirname;

const urlFields: Array<{
  template: string;
  control: string;
}> = [
  {
    template: 'service/service-form/service-form.component.html',
    control: 'serviceURL',
  },
  {
    template: 'service/service-form/service-form.component.html',
    control: 'getInformationURL',
  },
  {
    template: 'layers/layers-form/layers-form.component.html',
    control: 'datasetURL',
  },
  {
    template: 'layers/layers-form/layers-form.component.html',
    control: 'metadataURL',
  },
  {
    template: 'layers/layers-form/layers-form.component.html',
    control: 'legendURL',
  },
  {
    template: 'layers/layers-form/layers-form.component.html',
    control: 'url',
  },
  {
    template: 'territory/territory-form/territory-form.component.html',
    control: 'territorialAuthorityLogo',
  },
  {
    template: 'background-layers/background-layers-form/background-layers-form.component.html',
    control: 'image',
  },
  {
    template: 'application/application-form/application-form.component.html',
    control: 'logo',
  },
  {
    template: 'application/application-form/application-form.component.html',
    control: 'jspTemplate',
  },
  {
    template: 'application/application-form/application-form.component.html',
    control: 'url',
  },
  {
    template: 'trees/trees-form/tree-nodes/tree-nodes.component.html',
    control: 'metadataURL',
  },
  {
    template: 'trees/trees-form/tree-nodes/tree-nodes.component.html',
    control: 'datasetURL',
  },
];

function readTemplate(relativePath: string): string {
  return readFileSync(join(componentsRoot, relativePath), 'utf8');
}

function extractBlocks(template: string, openTagSource: string, closeTag: string): string[] {
  const blocks: string[] = [];
  let searchFrom = 0;
  while (searchFrom < template.length) {
    const openTag = new RegExp(openTagSource);
    const slice = template.slice(searchFrom);
    const match = openTag.exec(slice);
    if (!match) {
      break;
    }
    const start = searchFrom + match.index;
    const contentStart = start + match[0].length;
    const end = template.indexOf(closeTag, contentStart);
    if (end < 0) {
      break;
    }
    blocks.push(template.slice(start, end + closeTag.length));
    searchFrom = end + closeTag.length;
  }
  return blocks;
}

describe('External URL field navigation markup', () => {
  it('uses editable inputs with Material suffix open actions and no click hijacking', () => {
    for (const field of urlFields) {
      const template = readTemplate(field.template);
      const formFields = extractBlocks(template, '<mat-form-field\\b[^>]*>', '</mat-form-field>');
      const matchingFields = formFields.filter(block =>
        block.includes(`formControlName="${field.control}"`)
      );

      expect(matchingFields.length).toBeGreaterThan(0);

      for (const block of matchingFields) {
        expect(block).not.toContain('appUrlInput');
        expect(block).toContain('app-external-url-link');
        expect(block).toMatch(new RegExp(
          `app-external-url-link[\\s\\S]*\\[url\\]="[^"]*${field.control}[^"]*"`
        ));
        expect(block).toMatch(/matSuffix/);

        const inputMatch = block.match(new RegExp(
          `<input\\b[^>]*formControlName="${field.control}"[^>]*>`,
          'i'
        )) ?? block.match(new RegExp(
          `<input\\b[^>]*formControlName="${field.control}"[^\\n]*>`,
          'i'
        ));
        const inputTag = inputMatch?.[0] ?? '';
        expect(inputTag).toBeTruthy();
        expect(inputTag).not.toMatch(/\(click\)/);
        expect(inputTag).not.toMatch(/\(keydown\)/);
        expect(inputTag).not.toMatch(/\(keyup\)/);
      }
    }
  });

  it('no longer references the legacy UrlInputDirective selector anywhere in form templates', () => {
    for (const field of urlFields) {
      const template = readTemplate(field.template);
      expect(template).not.toContain('appUrlInput');
    }
  });
});
