/**
 * Task parameter type enum
 */
export enum TaskParameterType {
  TEMPLATE = 'template',
  QUERY = 'query'
}

/**
 * Task parameter model
 */
export class TaskEditionParameter {
  /** name */
  public name: string;

  /** label */
  public label: string;

  /** type - can be either template or query */
  public type: TaskParameterType;

  /** required - only present when type is query */
  public required?: boolean;

  /** key */
  public key: string;

  /** value */
  public value: string;

  /** order */
  public order: number;

  /** provided - backend-only secret variable (not sent to client) */
  public provided?: boolean;

  /**
   * Constructor for TaskParameter
   * @param name The name of the parameter
   * @param label The label of the parameter
   * @param type The type of the parameter - must be either template or query
   * @param required Whether the parameter is required - only used when type is query
   * @param value default value
   * @param provided Whether this is a backend-only secret variable
   */
  constructor(name?: string, label?: string, type?: TaskParameterType, required?: boolean, value?: string, provided?: boolean) {
    this.name = name;
    this.label = label;
    this.type = type;
    this.value = value;
    this.provided = provided;
    if (type === TaskParameterType.QUERY) {
      this.required = required;
    }
  }

  /**
   * Creates a new TaskParameter instance copying only the properties declared in TaskParameter class
   * @param source The source object to copy properties from
   * @returns A new TaskParameter instance with copied properties
   */
  public static fromObject(source: any): TaskEditionParameter {
    const parameter = new TaskEditionParameter();
    // Define the properties to copy
    const propertiesToCopy = [
      'name', 'label', 'type', 'value', 'provided'
    ];
    // Copy only defined properties that exist in our class
    propertiesToCopy.forEach(prop => {
      if (source[prop] !== undefined) {
        parameter[prop] = source[prop];
      }
    });
    // Only copy required if type is query
    if (source.type === TaskParameterType.QUERY && source.required !== undefined) {
      parameter.required = source.required;
    }
    return parameter;
  }
}

