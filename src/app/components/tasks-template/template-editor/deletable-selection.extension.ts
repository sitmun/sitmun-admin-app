import { Extension } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';

export const DeletableSelectionExtension = Extension.create({
  name: 'deletableSelection',

  addKeyboardShortcuts() {
    const deleteSelectedNode = () => {
      if (!(this.editor.state.selection instanceof NodeSelection)) {
        return false;
      }

      return this.editor.commands.deleteSelection();
    };

    return {
      Backspace: deleteSelectedNode,
      Delete: deleteSelectedNode,
    };
  },
});
