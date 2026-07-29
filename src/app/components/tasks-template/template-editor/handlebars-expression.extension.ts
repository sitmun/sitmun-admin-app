import { mergeAttributes, Node } from '@tiptap/core';

export const handlebarsExpressionHtmlAttribute = 'data-sitmun-handlebars-expr';

export const HandlebarsExpressionExtension = Node.create({
  name: 'handlebarsExpression',
  inline: true,
  group: 'inline',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      expression: {
        default: '',
        parseHTML: (element: HTMLElement) => {
          const encoded = element.getAttribute(handlebarsExpressionHtmlAttribute);
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
          [handlebarsExpressionHtmlAttribute]: encodeURIComponent(attributes.expression || ''),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `span[${handlebarsExpressionHtmlAttribute}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'sitmun-handlebars-expression-node' })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span');
      const expression = String(node.attrs['expression'] || '');
      dom.setAttribute(handlebarsExpressionHtmlAttribute, encodeURIComponent(expression));
      dom.className = 'sitmun-handlebars-expression-node';
      dom.textContent = expression;
      return { dom };
    };
  },
});
