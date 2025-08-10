/**
 * Menu item interface defining the structure of a menu item
 */
export interface MenuItem {
  id: string;

  label: string;

  icon: string;

  font?: string;

  children?: MenuItem[] | null;
}

/**
 * Form configuration interface defining common properties for forms
 */
export interface FormConfiguration {
  id: string;

  labelPlural: string;

  labelSingular: string;

  icon: string;

  font: string;

  route: string;

  formRoute: string;

  duplicateRoute: string;

  component: string;

  formComponent: string;
}

/**
 * SITMUN configuration class that defines common properties for each kind of form
 * This class centralizes SITMUN form configuration, making it easier to maintain
 * and extend the application's navigation structure.
 */
export class Configuration {
  /**
   * Dashboard configuration
   */
  static readonly DASHBOARD: FormConfiguration = {
    id: 'dashboard',
    labelSingular: 'dashboard.title',
    labelPlural: 'dashboard.title',
    icon: 'dashboard',
    font: 'material-icons-round',
    route: 'dashboard',
    formRoute: '',
    duplicateRoute: '',
    component: 'DashboardComponent',
    formComponent: ''
  };

  /**
   * Connection configuration
   */
  static readonly CONNECTION: FormConfiguration = {
    id: 'connection',
    labelSingular: 'entity.connection.label',
    labelPlural: 'entity.connection.label',
    icon: 'database',
    font: 'material-symbols-outlined',
    route: 'connection',
    formRoute: ':id/connectionForm',
    duplicateRoute: ':id/connectionForm/:idDuplicate',
    component: 'ConnectionComponent',
    formComponent: 'ConnectionFormComponent'
  };

  /**
   * Service configuration
   */
  static readonly SERVICE: FormConfiguration = {
    id: 'service',
    labelSingular: 'entity.service.label',
    labelPlural: 'entity.service.label',
    icon: 'api',
    font: 'material-symbols-outlined',
    route: 'service',
    formRoute: ':id/serviceForm',
    duplicateRoute: ':id/serviceForm/:idDuplicate',
    component: 'ServiceComponent',
    formComponent: 'ServiceFormComponent'
  };

  /**
   * Layers configuration
   */
  static readonly LAYER: FormConfiguration = {
    id: 'layers',
    labelSingular: 'entity.layer.label',
    labelPlural: 'entity.layer.label',
    icon: 'stacks',
    font: 'material-symbols-outlined',
    route: 'layers',
    formRoute: ':id/layersForm',
    duplicateRoute: ':id/layersForm/:idDuplicate',
    component: 'LayersComponent',
    formComponent: 'LayersFormComponent'
  };

  /**
   * Trees configuration
   */
  static readonly TREE: FormConfiguration = {
    id: 'trees',
    labelSingular: 'entity.tree.label',
    labelPlural: 'entity.tree.label',
    icon: 'lan',
    font: 'material-icons-round',
    route: 'trees',
    formRoute: ':id/treesForm',
    duplicateRoute: ':id/treesForm/:idDuplicate',
    component: 'TreesComponent',
    formComponent: 'TreesFormComponent'
  };

  /**
   * Background layers configuration
   */
  static readonly BACKGROUND_LAYER: FormConfiguration = {
    id: 'backgroundLayers',
    labelSingular: 'entity.background.label',
    labelPlural: 'entity.background.label',
    icon: 'map',
    font: 'material-symbols-outlined',
    route: 'backgroundLayers',
    formRoute: ':id/backgroundLayersForm',
    duplicateRoute: ':id/backgroundLayersForm/:idDuplicate',
    component: 'BackgroundLayersComponent',
    formComponent: 'BackgroundLayersFormComponent'
  };

  /**
   * Layers permits configuration
   */
  static readonly LAYERS_PERMIT: FormConfiguration = {
    id: 'layersPermits',
    labelSingular: 'entity.permissionGroup.label',
    labelPlural: 'entity.permissionGroup.label',
    icon: 'lock',
    font: 'material-icons-round',
    route: 'layersPermits',
    formRoute: ':id/layersPermitsForm',
    duplicateRoute: ':id/layersPermitsForm/:idDuplicate',
    component: 'LayersPermitsComponent',
    formComponent: 'LayersPermitsFormComponent'
  };

  /**
   * Territory configuration
   */
  static readonly TERRITORY: FormConfiguration = {
    id: 'territory',
    labelSingular: 'entity.territory.plural',
    labelPlural: 'entity.territory.plural',
    icon: 'place',
    font: 'material-icons-round',
    route: 'territory',
    formRoute: ':id/territoryForm',
    duplicateRoute: ':id/territoryForm/:idDuplicate',
    component: 'TerritoryComponent',
    formComponent: 'TerritoryFormComponent'
  };

  /**
   * Role configuration
   */
  static readonly ROLE: FormConfiguration = {
    id: 'role',
    labelSingular: 'entity.role.label',
    labelPlural: 'entity.role.label',
    icon: 'assignment_ind',
    font: 'material-icons-round',
    route: 'role',
    formRoute: ':id/roleForm',
    duplicateRoute: ':id/roleForm/:idDuplicate',
    component: 'RoleComponent',
    formComponent: 'RoleFormComponent'
  };

  /**
   * User configuration
   */
  static readonly USER: FormConfiguration = {
    id: 'user',
    labelSingular: 'entity.user.label',
    labelPlural: 'entity.user.label',
    icon: 'person',
    font: 'material-icons-round',
    route: 'user',
    formRoute: ':id/userForm',
    duplicateRoute: ':id/userForm/:idDuplicate',
    component: 'UserComponent',
    formComponent: 'UserFormComponent'
  };

  /**
   * Task group configuration
   */
  static readonly TASK_GROUP: FormConfiguration = {
    id: 'taskGroup',
    labelSingular: 'entity.taskGroup.label',
    labelPlural: 'entity.taskGroup.label',
    icon: 'list',
    font: 'material-icons-round',
    route: 'taskGroup',
    formRoute: ':id/taskGroupForm',
    duplicateRoute: ':id/taskGroupForm/:idDuplicate',
    component: 'TaskGroupComponent',
    formComponent: 'TaskGroupFormComponent'
  };

  /**
   * Tasks configuration with sub-items
   */
  static readonly TASK: FormConfiguration = {
    id: 'tasks',
    labelSingular: 'entity.task.label',
    labelPlural: 'entity.task.label',
    icon: 'task',
    font: 'material-icons-round',
    route: 'tasks',
    formRoute: ':id/:taskType',
    duplicateRoute: '',
    component: 'TasksComponent',
    formComponent: 'TaskFormComponent'
  };

  /**
   * Basic tasks configuration
   */
  static readonly TASK_BASIC: FormConfiguration = {
    id: 'tasksBasic',
    labelSingular: 'entity.task.basic.label',
    labelPlural: 'entity.task.basic.label',
    icon: 'task',
    font: 'material-icons-round',
    route: 'tasks/basic',
    formRoute: ':id/taskForm',
    duplicateRoute: ':id/taskForm/:idDuplicate',
    component: 'TasksBasicComponent',
    formComponent: 'TaskFormComponent'
  };

  /**
   * Query tasks configuration
   */
  static readonly TASK_QUERY: FormConfiguration = {
    id: 'tasksQuery',
    labelSingular: 'entity.task.query.label',
    labelPlural: 'entity.task.query.label',
    icon: 'task',
    font: 'material-icons-round',
    route: 'tasks/query',
    formRoute: ':id/taskForm',
    duplicateRoute: ':id/taskForm/:idDuplicate',
    component: 'TasksQueryComponent',
    formComponent: 'TaskFormComponent'
  };

  /**
   * Edit tasks configuration
   */
  static readonly TASK_EDIT: FormConfiguration = {
    id: 'tasksEdit',
    labelSingular: 'entity.task.edit.label',
    labelPlural: 'entity.task.edit.label',
    icon: 'task',
    font: 'material-icons-round',
    route: 'tasks/edit',
    formRoute: ':id/taskForm',
    duplicateRoute: ':id/taskForm/:idDuplicate',
    component: 'TasksEditComponent',
    formComponent: 'TaskFormComponent'
  };

  /**
   * Application configuration
   */
  static readonly APPLICATION: FormConfiguration = {
    id: 'application',
    labelSingular: 'entity.application.label',
    labelPlural: 'entity.application.label',
    icon: 'apps',
    font: 'material-icons-round',
    route: 'application',
    formRoute: ':id/applicationForm',
    duplicateRoute: ':id/applicationForm/:idDuplicate',
    component: 'ApplicationComponent',
    formComponent: 'ApplicationFormComponent'
  };

  /**
   * Get all form configurations as an array
   */
  static getAllConfigurations(): FormConfiguration[] {
    return [
      Configuration.DASHBOARD,
      Configuration.CONNECTION,
      Configuration.SERVICE,
      Configuration.LAYER,
      Configuration.TREE,
      Configuration.BACKGROUND_LAYER,
      Configuration.LAYERS_PERMIT,
      Configuration.TERRITORY,
      Configuration.ROLE,
      Configuration.USER,
      Configuration.TASK_GROUP,
      Configuration.TASK,
      Configuration.TASK_BASIC,
      Configuration.TASK_QUERY,
      Configuration.TASK_EDIT,
      Configuration.APPLICATION
    ];
  }

  /**
   * Get configuration by ID
   */
  static getConfigurationById(id: string): FormConfiguration | undefined {
    return this.getAllConfigurations().find(config => config.id === id);
  }

  /**
   * Convert form configuration to menu item
   */
  static toMenuItem(config: FormConfiguration): MenuItem {
    return {
      id: config.id,
      label: config.labelPlural,
      icon: config.icon,
      font: config.font,
      children: null
    };
  }

  /**
   * Get menu structure as defined in the original constants
   */
  static getMenuStructure(): MenuItem[][] {
    return [
      [
        Configuration.toMenuItem(Configuration.DASHBOARD)
      ],
      [
        Configuration.toMenuItem(Configuration.CONNECTION),
        Configuration.toMenuItem(Configuration.SERVICE),
        Configuration.toMenuItem(Configuration.LAYER),
        Configuration.toMenuItem(Configuration.TREE),
        Configuration.toMenuItem(Configuration.BACKGROUND_LAYER)
      ],
      [
        Configuration.toMenuItem(Configuration.LAYERS_PERMIT),
        Configuration.toMenuItem(Configuration.TERRITORY),
        Configuration.toMenuItem(Configuration.ROLE),
        Configuration.toMenuItem(Configuration.USER)
      ],
      [
        Configuration.toMenuItem(Configuration.TASK_GROUP),
        {
          ...Configuration.toMenuItem(Configuration.TASK),
          children: [
            Configuration.toMenuItem(Configuration.TASK_BASIC),
            Configuration.toMenuItem(Configuration.TASK_QUERY),
            Configuration.toMenuItem(Configuration.TASK_EDIT)
          ]
        }
      ],
      [
        Configuration.toMenuItem(Configuration.APPLICATION)
      ]
    ];
  }
}
