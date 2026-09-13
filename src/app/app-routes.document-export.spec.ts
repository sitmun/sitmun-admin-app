import { TaskDocumentExportFormComponent } from '@app/components/tasks-document-export/task-form/task-document-export-form.component';
import { TasksDocumentExportComponent } from '@app/components/tasks-document-export/tasks-document-export.component';
import { magic } from '@environments/constants';

import { APP_ROUTES } from './app-routes';

describe('APP_ROUTES document export wiring', () => {
  it('registers list and form routes for document export tasks', () => {
    const rootRoute = APP_ROUTES.find((route) => route.path === '');
    const childRoutes = rootRoute?.children ?? [];

    expect(childRoutes).toContainEqual(
      expect.objectContaining({ path: 'tasksDocumentExport', component: TasksDocumentExportComponent }),
    );
    expect(childRoutes).toContainEqual(
      expect.objectContaining({
        path: `taskDocumentExport/:id/:type`,
        component: TaskDocumentExportFormComponent,
      }),
    );
    expect(childRoutes).toContainEqual(
      expect.objectContaining({
        path: `tasks/:id/${magic.taskDocumentExportTypeId}`,
        component: TaskDocumentExportFormComponent,
      }),
    );
  });
});
