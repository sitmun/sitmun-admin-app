import { Extension } from '@tiptap/core';

export const SITMUN_EACH_HTML_ATTRIBUTE = 'data-sitmun-each';

export const HtmlAttributesExtension = Extension.create({
  name: 'htmlAttributes',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'table', 'tableRow', 'tableHeader', 'tableCell', 'image', 'iframe', 'translationLiteral', 'link'],
        attributes: {
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
          handlebarBlock: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('data-sitmun-handlebars-block'),
            renderHTML: (attributes: { handlebarBlock?: string | null }) => attributes.handlebarBlock ? { 'data-sitmun-handlebars-block': attributes.handlebarBlock } : {},
          },
        },
      },
      {
        types: ['table'],
        attributes: {
          sitmunEach: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute(SITMUN_EACH_HTML_ATTRIBUTE),
            renderHTML: (attributes: { sitmunEach?: string | null }) => {
              if (!attributes.sitmunEach) {
                return {};
              }

              const alias = String(attributes.sitmunEach).replace(/\.rows$/i, '');
              return {
                [SITMUN_EACH_HTML_ATTRIBUTE]: attributes.sitmunEach,
                'data-sitmun-each-alias': alias,
              };
            },
          },
        },
      },
    ];
  },
});
