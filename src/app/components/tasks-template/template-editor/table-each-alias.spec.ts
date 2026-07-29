import { Editor } from '@tiptap/core';
import { findTable, selectionCell } from '@tiptap/pm/tables';

import { createTemplateEditorExtensions } from './template-editor-extensions';

describe('table sitmunEach rebind', () => {
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

  it('updates only the selected table data-sitmun-each alias', () => {
    editor.commands.setContent(
      '<table data-sitmun-each="pepe.rows"><tbody><tr><td>{{name}}</td></tr></tbody></table>' +
        '<table data-sitmun-each="other.rows"><tbody><tr><td>{{code}}</td></tr></tbody></table>',
      false,
    );

    const firstCellPos = 4;
    editor.commands.setTextSelection(firstCellPos);
    const cell = selectionCell(editor.state);
    const table = findTable(cell);
    expect(table).toBeTruthy();

    editor.chain().setTextSelection(firstCellPos).updateAttributes('table', { sitmunEach: 'consulta_padron.rows' }).run();

    const html = editor.getHTML();
    expect(html).toContain('data-sitmun-each="consulta_padron.rows"');
    expect(html).toContain('data-sitmun-each="other.rows"');
    expect(html).not.toContain('data-sitmun-each="pepe.rows"');
  });

  it('keeps orphan alias value on the table until cleared', () => {
    editor.commands.setContent(
      '<table data-sitmun-each="missing_alias.rows"><tbody><tr><td>{{name}}</td></tr></tbody></table>',
      false,
    );

    expect(editor.getHTML()).toContain('data-sitmun-each="missing_alias.rows"');
    expect(editor.getHTML()).toContain('data-sitmun-each-alias="missing_alias"');
  });
});
