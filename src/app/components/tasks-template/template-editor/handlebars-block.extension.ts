import { mergeAttributes, Node } from '@tiptap/core';

export const handlebarsBlockHtmlAttribute = 'data-sitmun-handlebars-block';

export const HandlebarsBlockExtension = Node.create({
  name: 'handlebarsBlock',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      block: {
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute(handlebarsBlockHtmlAttribute),
        renderHTML: (attributes: { block?: string }) => ({
          [handlebarsBlockHtmlAttribute]: attributes.block || '',
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[${handlebarsBlockHtmlAttribute}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'sitmun-handlebars-block-node' })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      const block = String(node.attrs['block'] || '');
      dom.setAttribute(handlebarsBlockHtmlAttribute, block);
      dom.className = 'sitmun-handlebars-block-node';
      dom.textContent = decodeURIComponent(block);
      return { dom };
    };
  },
});
