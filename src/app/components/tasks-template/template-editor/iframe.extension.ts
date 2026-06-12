import { mergeAttributes, Node } from '@tiptap/core';

export const IframeExtension = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style'),
        renderHTML: (attributes: { style?: string | null }) => attributes.style ? { style: attributes.style } : {},
      },
      class: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('class'),
        renderHTML: (attributes: { class?: string | null }) => attributes.class ? { class: attributes.class } : {},
      },
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('width'),
        renderHTML: (attributes: { width?: string | null }) => attributes.width ? { width: attributes.width } : {},
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('height'),
        renderHTML: (attributes: { height?: string | null }) => attributes.height ? { height: attributes.height } : {},
      },
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('title'),
        renderHTML: (attributes: { title?: string | null }) => attributes.title ? { title: attributes.title } : {},
      },
      allow: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('allow'),
        renderHTML: (attributes: { allow?: string | null }) => attributes.allow ? { allow: attributes.allow } : {},
      },
      allowfullscreen: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('allowfullscreen'),
        renderHTML: (attributes: { allowfullscreen?: string | null }) => attributes.allowfullscreen != null ? { allowfullscreen: attributes.allowfullscreen } : {},
      },
      frameborder: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('frameborder'),
        renderHTML: (attributes: { frameborder?: string | null }) => attributes.frameborder ? { frameborder: attributes.frameborder } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: 'iframe' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('iframe');
      const attributes = node.attrs as Record<string, string | null>;
      for (const [key, value] of Object.entries(attributes)) {
        if (value != null) {
          dom.setAttribute(key, value);
        }
      }
      dom.setAttribute('contenteditable', 'false');
      return { dom };
    };
  },
});
