import { mergeAttributes, Node } from '@tiptap/core';

/**
 * Preserve authored `<div>` blocks.
 * Without this, StarterKit treats unknown blocks as paragraphs.
 * Defers `data-sitmun-handlebars-block` and `data-sitmun-html-comment` wrappers
 * to HandlebarsBlockExtension / HtmlCommentExtension.
 */
export const SitmunDivExtension = Node.create({
  name: 'div',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('class'),
        renderHTML: (attributes: { class?: string | null }) =>
          attributes.class ? { class: attributes.class } : {},
      },
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: { style?: string | null }) =>
          attributes.style ? { style: attributes.style } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          // Let dedicated extensions own chip / comment wrappers.
          if (
            element.hasAttribute('data-sitmun-handlebars-block') ||
            element.hasAttribute('data-sitmun-html-comment')
          ) {
            return false;
          }
          return {};
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },
});
