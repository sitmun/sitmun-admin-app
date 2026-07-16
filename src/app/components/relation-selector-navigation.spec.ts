import { readFileSync } from 'fs';
import { join } from 'path';

const componentsRoot = __dirname;

const relationSelectTemplates = [
  'application/application-form/application-form.component.html',
  'layers/layers-form/layers-form.component.html',
  'tasks-basic/task-form/task-basic-form.component.html',
  'tasks-query/task-form/task-query-form.component.html',
  'tasks-edit/task-form/task-edit-form.component.html',
  'trees/trees-form/tree-nodes/tree-nodes.component.html',
] as const;

const expectedOpenLinks: Array<{
  template: string;
  control: string;
  routeSegment: string;
  labelKey: string;
}> = [
  {
    template: 'application/application-form/application-form.component.html',
    control: 'creatorId',
    routeSegment: "'/user'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'application/application-form/application-form.component.html',
    control: 'situationMapId',
    routeSegment: "'/layersPermits'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'layers/layers-form/layers-form.component.html',
    control: 'serviceId',
    routeSegment: "'/service'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-basic/task-form/task-basic-form.component.html',
    control: 'taskGroupId',
    routeSegment: "'/taskGroup'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-query/task-form/task-query-form.component.html',
    control: 'taskGroupId',
    routeSegment: "'/taskGroup'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-query/task-form/task-query-form.component.html',
    control: 'connectionId',
    routeSegment: "'/connection'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-query/task-form/task-query-form.component.html',
    control: 'cartographyId',
    routeSegment: "'/layers'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-edit/task-form/task-edit-form.component.html',
    control: 'taskGroupId',
    routeSegment: "'/taskGroup'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-edit/task-form/task-edit-form.component.html',
    control: 'connectionId',
    routeSegment: "'/connection'",
    labelKey: 'common.relation.openNewTab',
  },
  {
    template: 'tasks-edit/task-form/task-edit-form.component.html',
    control: 'cartographyId',
    routeSegment: "'/layers'",
    labelKey: 'common.relation.openNewTab',
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

function stripMatSelect(field: string): string {
  return field.replace(/<mat-select\b[\s\S]*?<\/mat-select>/g, '');
}

describe('Relation selector navigation markup', () => {
  it('keeps mat-select choices and triggers free of router links', () => {
    for (const relativePath of relationSelectTemplates) {
      const template = readTemplate(relativePath);
      const selects = extractBlocks(template, '<mat-select\\b[^>]*>', '</mat-select>');
      for (const select of selects) {
        expect(select).not.toMatch(/\[routerLink\]/);
        expect(select).not.toMatch(/routerLink=/);
      }
    }
  });

  it('keeps autocomplete option labels free of router links', () => {
    const template = readTemplate('trees/trees-form/tree-nodes/tree-nodes.component.html');
    const options = extractBlocks(template, '<mat-option\\b[^>]*>', '</mat-option>');
    for (const option of options) {
      expect(option).not.toMatch(/\[routerLink\]/);
      expect(option).not.toMatch(/routerLink=/);
    }
  });

  it('keeps selected relation text plain with only a new-tab suffix action', () => {
    for (const expected of expectedOpenLinks) {
      const template = readTemplate(expected.template);
      const formFields = extractBlocks(template, '<mat-form-field\\b[^>]*>', '</mat-form-field>');
      const matchingFields = formFields.filter(field =>
        field.includes(`formControlName="${expected.control}"`)
      );

      expect(matchingFields.length).toBeGreaterThan(0);

      for (const field of matchingFields) {
        expect(field).not.toContain('relation-select-link-overlay');
        expect(field).not.toContain('relation-select-link-mode');
        expect(stripMatSelect(field)).not.toMatch(
          /<a\b(?![^>]*matSuffix)[^>]*\[routerLink\]/
        );
        expect(field).toMatch(/matSuffix/);
        expect(field).toMatch(/open_in_new/);
        expect(field).toContain('target="_blank"');
        expect(field).toContain('rel="noopener"');
        expect(field).toContain(expected.routeSegment);
        expect(field).toContain(`'${expected.labelKey}'`);
        expect(field).toMatch(/\[matTooltip\]/);
        expect(field).toMatch(/\[attr\.aria-label\]/);
        expect(field).not.toContain("'layerForm'");
        if (expected.control === 'cartographyId') {
          expect(field).toContain("'layersForm'");
        }
      }
    }
  });

  it('keeps tree relation autocompletes plain with only a new-tab suffix action', () => {
    const template = readTemplate('trees/trees-form/tree-nodes/tree-nodes.component.html');

    expect(template).not.toContain('entity-field-link-overlay');
    expect(template).not.toContain('entity-field-link-mode');
    expect(template).not.toMatch(/\[readonly\]="showCartographyAsLink"/);
    expect(template).not.toMatch(/\[readonly\]="showTaskAsLink"/);

    expect(template).toContain('getCartographyFormLink() as cartographyLink');
    expect(template).toContain("'entity.tree.openCartography'");
    expect(template).toContain('getTaskFormLink() as taskLink');
    expect(template).toContain("'entity.tree.openTask'");
    expect(template).toMatch(/related-entity-link-icon[\s\S]*open_in_new|open_in_new[\s\S]*related-entity-link-icon/);
    expect(template).toContain('target="_blank"');
    expect(template).toContain('rel="noopener"');
    expect(template).toContain('entity-field-clear-button');
    expect(template).toContain('[matAutocomplete]="cartographyAutocomplete"');
    expect(template).toContain('[matAutocomplete]="taskAutocomplete"');
  });
});
