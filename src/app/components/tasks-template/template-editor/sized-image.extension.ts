import { mergeAttributes } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { NodeSelection } from '@tiptap/pm/state';

import { createMustacheMediaPlaceholder, isMustacheMediaSrc } from './mustache-media';

export const SizedImageExtension = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('src'),
        renderHTML: (attributes: { src?: string | null }) => attributes.src ? { src: attributes.src } : {},
      },
      alt: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('alt'),
        renderHTML: (attributes: { alt?: string | null }) => attributes.alt ? { alt: attributes.alt } : {},
      },
      title: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('title'),
        renderHTML: (attributes: { title?: string | null }) => attributes.title ? { title: attributes.title } : {},
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom: HTMLElement | string) => {
          if (typeof dom === 'string') return false;
          const src = dom.getAttribute('src');
          if (!src) return false;
          return { src };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'sitmun-resizable-image';
      wrapper.contentEditable = 'false';

      let media: HTMLElement;
      let currentSrc = String(node.attrs['src'] || '');
      let mustacheMode = isMustacheMediaSrc(currentSrc);

      const handle = document.createElement('span');
      handle.className = 'sitmun-resizable-image__handle';

      const applySize = (target: HTMLElement, width: number | null, height: number | null) => {
        target.style.width = width ? `${width}px` : '';
        target.style.height = height ? `${height}px` : '';

        if (target instanceof HTMLImageElement) {
          if (width) {
            target.setAttribute('width', String(width));
          } else {
            target.removeAttribute('width');
          }

          if (height) {
            target.setAttribute('height', String(height));
          } else {
            target.removeAttribute('height');
          }
        }
      };

      const readDimension = (value: unknown): number | null => {
        const numericValue = Number.parseInt(String(value || ''), 10);
        return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
      };

      const buildImage = (attrs: Record<string, unknown>): HTMLImageElement => {
        const image = document.createElement('img');
        for (const [key, value] of Object.entries(attrs)) {
          if (value == null || (key === 'src' && isMustacheMediaSrc(String(value)))) {
            continue;
          }
          image.setAttribute(key, String(value));
        }
        if (attrs['src'] != null && !isMustacheMediaSrc(String(attrs['src']))) {
          image.setAttribute('src', String(attrs['src']));
        }
        return image;
      };

      const mountMedia = (attrs: Record<string, unknown>) => {
        const src = String(attrs['src'] || '');
        mustacheMode = isMustacheMediaSrc(src);
        currentSrc = src;
        media = mustacheMode
          ? createMustacheMediaPlaceholder('img', src)
          : buildImage(attrs);
        applySize(media, readDimension(attrs['width']), readDimension(attrs['height']));
        wrapper.replaceChildren(media, handle);
        handle.style.display = mustacheMode ? 'none' : '';
      };

      mountMedia(node.attrs as Record<string, unknown>);

      const selectNode = () => {
        const position = getPos();
        if (typeof position !== 'number') {
          return;
        }

        const transaction = editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, position));
        editor.view.dispatch(transaction);
      };

      wrapper.addEventListener('mousedown', (event) => {
        if (event.target === handle) {
          return;
        }

        selectNode();
      });

      handle.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (mustacheMode || !(media instanceof HTMLImageElement)) {
          return;
        }

        selectNode();

        const rect = media.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startX = event.clientX;
        const startY = event.clientY;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const nextWidth = Math.max(24, Math.round(startWidth + (moveEvent.clientX - startX)));
          const nextHeight = Math.max(24, Math.round(startHeight + (moveEvent.clientY - startY)));
          applySize(media, nextWidth, nextHeight);
        };

        const onMouseUp = (upEvent: MouseEvent) => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);

          const finalWidth = Math.max(24, Math.round(startWidth + (upEvent.clientX - startX)));
          const finalHeight = Math.max(24, Math.round(startHeight + (upEvent.clientY - startY)));
          applySize(media, finalWidth, finalHeight);
          editor.commands.updateAttributes('image', {
            width: String(finalWidth),
            height: String(finalHeight),
          });
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      return {
        dom: wrapper,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'image') {
            return false;
          }

          const nextSrc = String(updatedNode.attrs['src'] || '');
          const nextMustache = isMustacheMediaSrc(nextSrc);
          if (nextMustache !== mustacheMode) {
            mountMedia(updatedNode.attrs as Record<string, unknown>);
            return true;
          }

          if (mustacheMode) {
            if (nextSrc !== currentSrc) {
              const label = media.querySelector('.sitmun-mustache-media-placeholder__src');
              if (label) {
                label.textContent = nextSrc;
              }
              currentSrc = nextSrc;
            }
            applySize(media, readDimension(updatedNode.attrs['width']), readDimension(updatedNode.attrs['height']));
            return true;
          }

          if (!(media instanceof HTMLImageElement)) {
            return false;
          }

          for (const [key, value] of Object.entries(updatedNode.attrs)) {
            if (value == null) {
              media.removeAttribute(key);
              continue;
            }
            media.setAttribute(key, String(value));
          }
          applySize(media, readDimension(updatedNode.attrs['width']), readDimension(updatedNode.attrs['height']));
          return true;
        },
      };
    };
  },
});
