import { mergeAttributes } from '@tiptap/core';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

/** Internal: source table already had a colgroup (keep TipTap chrome on serialize). */
export const SITMUN_TABLE_HAD_COLGROUP = 'data-sitmun-had-colgroup';
/** Internal: source cell was bare text/inline (unwrap sole TipTap `<p>` on serialize). */
export const SITMUN_CELL_BARE = 'data-sitmun-cell-bare';

/**
 * Table schema that records source colgroup presence and omits generated colgroup/min-width
 * when the authored table did not have them.
 */
export const SitmunTableExtension = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      hadColgroup: {
        default: false,
        parseHTML: (element: HTMLElement) =>
          element.hasAttribute(SITMUN_TABLE_HAD_COLGROUP)
          || element.querySelector(':scope > colgroup') != null,
        renderHTML: (attributes: { hadColgroup?: boolean }) =>
          attributes.hadColgroup ? { [SITMUN_TABLE_HAD_COLGROUP]: 'true' } : {},
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const hadColgroup = !!node.attrs['hadColgroup'];
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    delete attrs[SITMUN_TABLE_HAD_COLGROUP];

    if (hadColgroup) {
      const cols: Array<['col', Record<string, string>]> = [];
      node.forEach((row) => {
        if (row.type.name !== 'tableRow') {
          return;
        }
        let index = 0;
        row.forEach((cell) => {
          if (cols[index]) {
            index += 1;
            return;
          }
          const colwidth = cell.attrs['colwidth'] as number[] | null | undefined;
          const style = colwidth?.[0] ? `min-width: ${colwidth[0]}px;` : undefined;
          cols[index] = ['col', style ? { style } : {}];
          index += 1;
        });
      });
      return ['table', attrs, ['colgroup', {}, ...cols], ['tbody', 0]];
    }

    return ['table', attrs, ['tbody', 0]];
  },
}).configure({
  resizable: false,
  allowTableNodeSelection: true,
});

function bareCellAttributes() {
  return {
    bare: {
      default: false,
      parseHTML: (element: HTMLElement) => {
        if (element.hasAttribute(SITMUN_CELL_BARE)) {
          return true;
        }
        // Bare = no block-level child in the authored cell (TipTap will wrap content in <p>).
        const children = Array.from(element.childNodes).filter(
          (child) => !(child.nodeType === 3 && !child.textContent?.trim()),
        );
        if (children.length === 0) {
          return true;
        }
        if (children.length === 1 && children[0].nodeType === 3) {
          return true;
        }
        return children.every((child) => {
          if (child.nodeType !== 1) {
            return child.nodeType === 3;
          }
          const tag = (child as Element).tagName;
          return !['P', 'DIV', 'UL', 'OL', 'TABLE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE'].includes(tag);
        });
      },
      renderHTML: (attributes: { bare?: boolean }) =>
        attributes.bare ? { [SITMUN_CELL_BARE]: 'true' } : {},
    },
  };
}

/** Drop default colspan/rowspan="1" noise from TipTap cell HTML. */
function omitDefaultSpanAttrs(HTMLAttributes: Record<string, unknown>): Record<string, unknown> {
  const attrs = { ...HTMLAttributes };
  if (attrs['colspan'] === 1 || attrs['colspan'] === '1') {
    delete attrs['colspan'];
  }
  if (attrs['rowspan'] === 1 || attrs['rowspan'] === '1') {
    delete attrs['rowspan'];
  }
  // Keep SITMUN_CELL_BARE so serialize can unwrap generated cell paragraphs.
  return attrs;
}

/** td with bare-cell provenance (see {@link scrubTipTapTableSerializeArtifacts}). */
export const SitmunTableCellExtension = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...bareCellAttributes(),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['td', mergeAttributes(this.options.HTMLAttributes, omitDefaultSpanAttrs(HTMLAttributes)), 0];
  },
});

/** th with bare-cell provenance (see {@link scrubTipTapTableSerializeArtifacts}). */
export const SitmunTableHeaderExtension = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...bareCellAttributes(),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['th', mergeAttributes(this.options.HTMLAttributes, omitDefaultSpanAttrs(HTMLAttributes)), 0];
  },
});

/**
 * After TipTap getHTML: remove provenance attrs; drop injected colgroup/min-width when source
 * lacked them; unwrap a sole `<p>` in bare cells.
 */
export function scrubTipTapTableSerializeArtifacts(root: ParentNode): void {
  for (const table of Array.from(root.querySelectorAll('table'))) {
    const hadColgroup = table.hasAttribute(SITMUN_TABLE_HAD_COLGROUP);
    table.removeAttribute(SITMUN_TABLE_HAD_COLGROUP);
    if (!hadColgroup) {
      table.querySelector(':scope > colgroup')?.remove();
      for (const cell of Array.from(table.querySelectorAll('td, th'))) {
        const style = cell.getAttribute('style');
        if (!style?.toLowerCase().includes('min-width')) {
          continue;
        }
        const next = style
          .split(';')
          .map((part) => part.trim())
          .filter((part) => part && !part.toLowerCase().startsWith('min-width'))
          .join('; ');
        if (next) {
          cell.setAttribute('style', next);
        } else {
          cell.removeAttribute('style');
        }
      }
    }
  }

  for (const cell of Array.from(root.querySelectorAll(`td[${SITMUN_CELL_BARE}], th[${SITMUN_CELL_BARE}]`))) {
    cell.removeAttribute(SITMUN_CELL_BARE);
    const children = Array.from(cell.children);
    if (children.length === 1 && children[0].tagName === 'P') {
      const paragraph = children[0];
      while (paragraph.firstChild) {
        cell.insertBefore(paragraph.firstChild, paragraph);
      }
      paragraph.remove();
    }
  }

  for (const cell of Array.from(root.querySelectorAll('td, th'))) {
    cell.removeAttribute(SITMUN_CELL_BARE);
  }
}
