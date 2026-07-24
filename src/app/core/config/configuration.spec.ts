import {APP_ROUTES} from '@app/app-routes';

import {Configuration} from './configuration';

describe('Configuration task metadata', () => {
  const authenticatedChildren = APP_ROUTES.find((route) => route.path === '')?.children ?? [];
  const routePaths = new Set(
    authenticatedChildren.map((child) => child.path).filter((path): path is string => !!path),
  );

  const taskFormConfigs = [
    Configuration.TASK_BASIC,
    Configuration.TASK_QUERY,
    Configuration.TASK_LOCATOR,
    Configuration.TASK_MORE_INFO,
    Configuration.TASK_TEMPLATE,
    Configuration.TASK_MORE_INFO_ADVANCED,
    Configuration.TASK_EDIT,
  ];

  it('registers task list and form routes in APP_ROUTES', () => {
    for (const config of taskFormConfigs) {
      expect(routePaths.has(config.route)).toBe(true);
      expect(routePaths.has(config.formRoute)).toBe(true);
    }
  });

  it('includes More Info and MIA in getAllConfigurations()', () => {
    const ids = Configuration.getAllConfigurations().map((c) => c.id);
    expect(ids).toContain(Configuration.TASK_MORE_INFO.id);
    expect(ids).toContain(Configuration.TASK_MORE_INFO_ADVANCED.id);
  });

  it('includes More Info and MIA under Tasks in the menu structure', () => {
    const taskGroup = Configuration.getMenuStructure()
      .flat()
      .find((item) => item.id === Configuration.TASK.id);
    const childIds = (taskGroup?.children ?? []).map((child) => child.id);
    expect(childIds).toContain(Configuration.TASK_MORE_INFO.id);
    expect(childIds).toContain(Configuration.TASK_MORE_INFO_ADVANCED.id);
  });
});
