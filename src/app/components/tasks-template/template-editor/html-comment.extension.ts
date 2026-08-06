import { mergeAttributes, Node } from '@tiptap/core';

/**
 * TipTap drops real HTML comments on DOM parse. Protect converts `<!--…-->` into this
 * marker node; serialize restores the comment string from the data attribute.
 */
export const htmlCommentHtmlAttribute = 'data-sitmun-html-comment';

export const HtmlCommentExtension = Node.create({
  name: 'htmlComment',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      comment: {
        default: '',
        parseHTML: (element: HTMLElement) => {
          const encoded = element.getAttribute(htmlCommentHtmlAttribute);
          if (!encoded) {
            return '';
          }
          try {
            return decodeURIComponent(encoded);
          } catch {
            return encoded;
          }
        },
        renderHTML: (attributes: { comment?: string }) => ({
          [htmlCommentHtmlAttribute]: encodeURIComponent(attributes.comment || ''),
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[${htmlCommentHtmlAttribute}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'sitmun-html-comment-node' })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      const comment = String(node.attrs['comment'] || '');
      dom.setAttribute(htmlCommentHtmlAttribute, encodeURIComponent(comment));
      dom.className = 'sitmun-html-comment-node';
      dom.textContent = comment;
      return { dom };
    };
  },
});
