import { mergeAttributes, Node } from '@tiptap/core';

/** Matches backend {@code TemplateRenderService} system-variable form {@code {{#UPPER_CASE}}}. */
export const handlebarsSystemVariableHtmlAttribute = 'data-sitmun-handlebars-sysvar';

export const SYSTEM_VARIABLE_MUSTACHE_PATTERN = /\{\{\s*(#[A-Z_][A-Z0-9_]*)\s*}}/g;

export function isSystemVariableMustache(match: string): boolean {
  return /^\{\{\s*#[A-Z_][A-Z0-9_]*\s*}}$/.test(match);
}

export const HandlebarsSystemVariableExtension = Node.create({
  name: 'handlebarsSystemVariable',
  inline: true,
  group: 'inline',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      expression: {
        default: '',
        parseHTML: (element: HTMLElement) => {
          const encoded = element.getAttribute(handlebarsSystemVariableHtmlAttribute);
          if (!encoded) {
            return element.textContent || '';
          }

          try {
            return decodeURIComponent(encoded);
          } catch {
            return encoded;
          }
        },
        renderHTML: (attributes: { expression?: string }) => ({
          [handlebarsSystemVariableHtmlAttribute]: encodeURIComponent(attributes.expression || ''),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `span[${handlebarsSystemVariableHtmlAttribute}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'sitmun-handlebars-system-variable-node' })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span');
      const expression = String(node.attrs['expression'] || '');
      dom.setAttribute(handlebarsSystemVariableHtmlAttribute, encodeURIComponent(expression));
      dom.className = 'sitmun-handlebars-system-variable-node';
      dom.textContent = expression;
      return { dom };
    };
  },
});
