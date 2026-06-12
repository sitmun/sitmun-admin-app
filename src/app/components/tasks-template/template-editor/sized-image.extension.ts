import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';

export const SizedImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
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

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, editor, getPos, HTMLAttributes }) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'sitmun-resizable-image';
      wrapper.contentEditable = 'false';

      const image = document.createElement('img');
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value != null) {
          image.setAttribute(key, String(value));
        }
      });

      const handle = document.createElement('span');
      handle.className = 'sitmun-resizable-image__handle';

      const applySize = (width: number | null, height: number | null) => {
        image.style.width = width ? `${width}px` : '';
        image.style.height = height ? `${height}px` : '';

        if (width) {
          image.setAttribute('width', String(width));
        } else {
          image.removeAttribute('width');
        }

        if (height) {
          image.setAttribute('height', String(height));
        } else {
          image.removeAttribute('height');
        }
      };

      const readDimension = (value: unknown): number | null => {
        const numericValue = Number.parseInt(String(value || ''), 10);
        return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
      };

      applySize(readDimension(node.attrs['width']), readDimension(node.attrs['height']));

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

        selectNode();

        const rect = image.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startX = event.clientX;
        const startY = event.clientY;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const nextWidth = Math.max(24, Math.round(startWidth + (moveEvent.clientX - startX)));
          const nextHeight = Math.max(24, Math.round(startHeight + (moveEvent.clientY - startY)));
          applySize(nextWidth, nextHeight);
        };

        const onMouseUp = (upEvent: MouseEvent) => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);

          const finalWidth = Math.max(24, Math.round(startWidth + (upEvent.clientX - startX)));
          const finalHeight = Math.max(24, Math.round(startHeight + (upEvent.clientY - startY)));
          applySize(finalWidth, finalHeight);
          editor.commands.updateAttributes('image', {
            width: String(finalWidth),
            height: String(finalHeight),
          });
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      wrapper.appendChild(image);
      wrapper.appendChild(handle);

      return {
        dom: wrapper,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) {
            return false;
          }

          Object.entries(updatedNode.attrs).forEach(([key, value]) => {
            if (value == null) {
              image.removeAttribute(key);
              return;
            }

            image.setAttribute(key, String(value));
          });
          applySize(readDimension(updatedNode.attrs['width']), readDimension(updatedNode.attrs['height']));
          return true;
        },
      };
    };
  },
});
