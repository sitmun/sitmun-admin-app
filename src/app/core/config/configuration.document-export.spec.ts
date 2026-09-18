import { Configuration } from './configuration';

describe('Configuration document export wiring', () => {
  it('exposes document export config in global configuration list and menu item', () => {
    expect(Configuration.getAllConfigurations()).toContain(Configuration.TASK_DOCUMENT_EXPORT);
    expect(Configuration.TASK_DOCUMENT_EXPORT.id).toBe('tasksDocumentExport');
    expect(Configuration.TASK_DOCUMENT_EXPORT.route).toBe('tasksDocumentExport');
    expect(Configuration.toMenuItem(Configuration.TASK_DOCUMENT_EXPORT)).toEqual(
      expect.objectContaining({
        id: 'tasksDocumentExport',
        label: 'entity.task.documentExport.label',
        icon: 'picture_as_pdf',
      }),
    );
  });
});
