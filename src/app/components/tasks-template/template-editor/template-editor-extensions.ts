import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

import { DeletableSelectionExtension } from './deletable-selection.extension';
import { FontSizeExtension } from './font-size.extension';
import { HandlebarsBlockExtension } from './handlebars-block.extension';
import { HandlebarsExpressionExtension } from './handlebars-expression.extension';
import { HandlebarsSystemVariableExtension } from './handlebars-system-variable.extension';
import { HtmlAttributesExtension } from './html-attributes.extension';
import { HtmlCommentExtension } from './html-comment.extension';
import { IframeExtension } from './iframe.extension';
import { SitmunDivExtension } from './sitmun-div.extension';
import {
  SitmunTableCellExtension,
  SitmunTableExtension,
  SitmunTableHeaderExtension,
} from './sitmun-table.extension';
import { SizedImageExtension } from './sized-image.extension';
import { TranslationLiteralExtension } from './translation-literal.extension';

/** TipTap extension set for Plantilla visual editor (Jest + runtime share this list). */
export function createTemplateEditorExtensions() {
  return [
    StarterKit.configure({
      codeBlock: false,
      horizontalRule: false,
    }),
    SitmunDivExtension,
    Underline,
    TextStyle,
    FontSizeExtension,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'div'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    Link.configure({
      openOnClick: false,
      // Explicit nulls override TipTap defaults (mergeDeep keeps nested keys for empty {}).
      // Toolbar insert sets target/rel; authored links round-trip without forced attrs.
      HTMLAttributes: {
        target: null,
        rel: null,
        class: null,
      },
    }),
    SizedImageExtension,
    SitmunTableExtension,
    TableRow,
    SitmunTableHeaderExtension,
    SitmunTableCellExtension,
    IframeExtension,
    TranslationLiteralExtension,
    HandlebarsSystemVariableExtension,
    HandlebarsBlockExtension,
    HandlebarsExpressionExtension,
    HtmlCommentExtension,
    HtmlAttributesExtension,
    DeletableSelectionExtension,
  ];
}
