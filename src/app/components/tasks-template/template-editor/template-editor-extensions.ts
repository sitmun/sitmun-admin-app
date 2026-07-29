import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
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
import { IframeExtension } from './iframe.extension';
import { SizedImageExtension } from './sized-image.extension';
import { TranslationLiteralExtension } from './translation-literal.extension';

/** Production TipTap extension list for the template visual editor (shared with Jest). */
export function createTemplateEditorExtensions() {
  return [
    StarterKit.configure({
      codeBlock: false,
      horizontalRule: false,
    }),
    Underline,
    TextStyle,
    FontSizeExtension,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
      },
    }),
    SizedImageExtension,
    Table.configure({
      resizable: false,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    IframeExtension,
    TranslationLiteralExtension,
    HandlebarsSystemVariableExtension,
    HandlebarsBlockExtension,
    HandlebarsExpressionExtension,
    HtmlAttributesExtension,
    DeletableSelectionExtension,
  ];
}
