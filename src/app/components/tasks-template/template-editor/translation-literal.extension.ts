import { mergeAttributes, Node } from '@tiptap/core';

const TRANSLATION_LITERAL_ATTR = 'data-sitmun-translation-literal';
const TRANSLATION_LITERAL_HTML_ATTR = 'data-sitmun-translation-html';

function decodeStoredHtml(value: string | null): string {
  if (!value) {
    return '';
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const TranslationLiteralExtension = Node.create({
  name: 'translationLiteral',
  inline: true,
  group: 'inline',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      html: {
        default: '',
        parseHTML: (element: HTMLElement) => {
          if (element.tagName.toLowerCase() === 't') {
            return element.innerHTML;
          }

          return decodeStoredHtml(element.getAttribute(TRANSLATION_LITERAL_HTML_ATTR));
        },
        renderHTML: (attributes: { html?: string }) => ({
          [TRANSLATION_LITERAL_HTML_ATTR]: encodeURIComponent(attributes.html || ''),
        }),
      },
      class: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('class'),
        renderHTML: (attributes: { class?: string | null }) => attributes.class ? { class: attributes.class } : {},
      },
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: { style?: string | null }) => attributes.style ? { style: attributes.style } : {},
      },
    };
  },

  parseHTML() {
    return [
      { tag: 't' },
      { tag: `span[${TRANSLATION_LITERAL_ATTR}="true"]` },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, {
      [TRANSLATION_LITERAL_ATTR]: 'true',
      class: 'sitmun-translation-literal-node',
    })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span');
      dom.setAttribute(TRANSLATION_LITERAL_ATTR, 'true');
      dom.setAttribute(TRANSLATION_LITERAL_HTML_ATTR, encodeURIComponent(String(node.attrs['html'] || '')));
      dom.className = 'sitmun-translation-literal-node';

      const label = document.createElement('span');
      label.className = 'sitmun-translation-literal-node__label';
      label.textContent = 'T';

      const preview = document.createElement('span');
      preview.className = 'sitmun-translation-literal-node__preview';
      preview.innerHTML = String(node.attrs['html'] || '');

      dom.append(label, preview);
      return { dom };
    };
  },
});

export const translationLiteralSelector = `[${TRANSLATION_LITERAL_ATTR}="true"]`;
export const translationLiteralHtmlAttribute = TRANSLATION_LITERAL_HTML_ATTR;
