import { Editor } from '@tiptap/core';

import { createTemplateEditorExtensions } from './template-editor-extensions';

describe('HtmlAttributesExtension table data-sitmun-each', () => {
  let host: HTMLDivElement;
  let editor: Editor;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    editor = new Editor({
      element: host,
      extensions: createTemplateEditorExtensions(),
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
    host.remove();
  });

  it('preserves data-sitmun-each on table after a sibling paragraph is inserted', () => {
    const tableHtml =
      '<table data-sitmun-each="pepe.rows"><thead><tr><th>name</th></tr></thead><tbody><tr><td>{{name}}</td></tr></tbody></table>';

    editor.commands.setContent(tableHtml, false);
    editor.commands.insertContentAt(0, '<p>sibling</p>');

    expect(editor.getHTML()).toContain('data-sitmun-each="pepe.rows"');
  });
});
