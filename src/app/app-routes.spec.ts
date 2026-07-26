import {TaskLocatorFormComponent} from '@app/components/tasks-locator/task-form/task-locator-form.component';
import {TaskMoreInfoFormComponent} from '@app/components/tasks-more-info/task-form/task-more-info-form.component';
import {TaskMoreInfoAdvancedFormComponent} from '@app/components/tasks-more-info-advanced/task-form/task-more-info-advanced-form.component';
import {magic} from '@environments/constants';

import {APP_ROUTES} from './app-routes';

describe('APP_ROUTES deep task form routes', () => {
  const authenticatedChildren = APP_ROUTES.find((route) => route.path === '')?.children ?? [];

  it.each([
    {
      path: `tasks/:id/${magic.taskLocatorTypeId}`,
      component: TaskLocatorFormComponent,
    },
    {
      path: `tasks/:id/${magic.taskMoreInfoTypeId}`,
      component: TaskMoreInfoFormComponent,
    },
    {
      path: `tasks/:id/${magic.taskMoreInfoAdvancedTypeId}`,
      component: TaskMoreInfoAdvancedFormComponent,
    },
  ])('registers $path', ({path, component}) => {
    const route = authenticatedChildren.find((child) => child.path === path);
    expect(route).toBeDefined();
    expect(route?.component).toBe(component);
  });
});
